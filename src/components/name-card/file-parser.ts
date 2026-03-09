import * as XLSX from "xlsx";
import type { Person } from "./types";

/**
 * Expected columns (in order):
 *   1. "Họ và tên"
 *   2. "Chức vụ công tác"
 *   3. "Chức danh trong ban"
 *
 * The parser uses flexible matching: exact → starts-with → contains,
 * with accent-stripped normalization so minor variations still work.
 */

/* ── helpers ─────────────────────────────────────────────────── */

/** Strip Vietnamese diacritics and normalise whitespace. */
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s]+/g, " ")
    .trim();
}

const COLUMN_DEFS = [
  { key: "name",     aliases: ["ho va ten", "ho ten", "name", "full name"] },
  { key: "chucVu",   aliases: ["chuc vu cong tac", "chuc vu", "position", "job title"] },
  { key: "chucDanh", aliases: ["chuc danh trong ban", "chuc danh", "title", "rank"] },
] as const;

/**
 * Find the column index for a given set of aliases using a tiered strategy:
 *   1. Exact match
 *   2. Starts-with
 *   3. Contains
 */
function findColumnIndex(
  normalizedHeaders: string[],
  aliases: readonly string[],
  usedIndices: Set<number>,
): number {
  const normalizedAliases = aliases.map(normalize);

  // Priority 1 – exact
  for (const alias of normalizedAliases) {
    const idx = normalizedHeaders.findIndex((h, i) => !usedIndices.has(i) && h === alias);
    if (idx !== -1) return idx;
  }
  // Priority 2 – starts-with
  for (const alias of normalizedAliases) {
    const idx = normalizedHeaders.findIndex((h, i) => !usedIndices.has(i) && h.startsWith(alias));
    if (idx !== -1) return idx;
  }
  // Priority 3 – contains
  for (const alias of normalizedAliases) {
    const idx = normalizedHeaders.findIndex((h, i) => !usedIndices.has(i) && h.includes(alias));
    if (idx !== -1) return idx;
  }

  return -1;
}

interface ColumnMap {
  nameIdx: number;
  chucVuIdx: number;
  chucDanhIdx: number;
}

function mapHeaders(headers: string[]): ColumnMap {
  const normalizedHeaders = headers.map(normalize);
  const used = new Set<number>();

  const nameIdx = findColumnIndex(normalizedHeaders, COLUMN_DEFS[0].aliases, used);
  if (nameIdx !== -1) used.add(nameIdx);

  const chucVuIdx = findColumnIndex(normalizedHeaders, COLUMN_DEFS[1].aliases, used);
  if (chucVuIdx !== -1) used.add(chucVuIdx);

  const chucDanhIdx = findColumnIndex(normalizedHeaders, COLUMN_DEFS[2].aliases, used);

  return { nameIdx, chucVuIdx, chucDanhIdx };
}

/* ── row → Person[] ──────────────────────────────────────────── */

function rowsToPeople(rows: string[][], startId: number): Person[] {
  if (rows.length < 2) return [];

  const { nameIdx, chucVuIdx, chucDanhIdx } = mapHeaders(rows[0]);

  if (nameIdx === -1) {
    throw new Error(
      'Không tìm thấy cột "Họ và tên". Vui lòng đảm bảo file có cột: Họ và tên | Chức vụ công tác | Chức danh trong ban',
    );
  }

  const people: Person[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[nameIdx]?.trim();
    if (!name) continue;

    people.push({
      id: startId + people.length,
      name,
      chucVu: chucVuIdx !== -1 ? (row[chucVuIdx]?.trim() || "") : "",
      chucDanh: chucDanhIdx !== -1 ? (row[chucDanhIdx]?.trim() || "") : "THÀNH VIÊN",
    });
  }

  return people;
}

/* ── CSV parsing ─────────────────────────────────────────────── */

function parseCSV(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")));
}

/* ── public API ──────────────────────────────────────────────── */

/**
 * Parse an uploaded CSV or Excel file and return a list of Person objects.
 *
 * Expected column order: Họ và tên | Chức vụ công tác | Chức danh trong ban
 */
export async function parseNameListFile(file: File, startId: number): Promise<Person[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "csv" || ext === "txt") {
    const text = await file.text();
    const rows = parseCSV(text);
    return rowsToPeople(rows, startId);
  }

  if (ext === "xlsx" || ext === "xls") {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return rowsToPeople(rows, startId);
  }

  throw new Error("Định dạng file không hỗ trợ. Vui lòng dùng .csv, .xlsx hoặc .xls");
}
