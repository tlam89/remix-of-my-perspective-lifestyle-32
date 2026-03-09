import * as XLSX from "xlsx";
import type { Person } from "./types";

/**
 * Expected columns (case-insensitive, trimmed):
 *   - "Họ và Tên" / "Họ tên" / "name"        → person.name
 *   - "Chức vụ công tác" / "Chức vụ" / "chucVu" → person.chucVu
 *   - "Chức danh trong ban" / "Chức danh" / "chucDanh" → person.chucDanh
 */

const NAME_ALIASES = ["họ và tên", "họ tên", "name", "ho va ten", "ho ten"];
const CHUCVU_ALIASES = ["chức vụ công tác", "chức vụ", "chucvu", "chuc vu cong tac", "chuc vu"];
const CHUCDANH_ALIASES = ["chức danh trong ban", "chức danh", "chucdanh", "chuc danh trong ban", "chuc danh"];

function matchColumn(header: string, aliases: string[]): boolean {
  const normalized = header.trim().toLowerCase();
  return aliases.some((a) => normalized === a || normalized.includes(a));
}

function mapHeaders(headers: string[]): { nameIdx: number; chucVuIdx: number; chucDanhIdx: number } {
  let nameIdx = -1, chucVuIdx = -1, chucDanhIdx = -1;

  headers.forEach((h, i) => {
    if (nameIdx === -1 && matchColumn(h, NAME_ALIASES)) nameIdx = i;
    else if (chucVuIdx === -1 && matchColumn(h, CHUCVU_ALIASES)) chucVuIdx = i;
    else if (chucDanhIdx === -1 && matchColumn(h, CHUCDANH_ALIASES)) chucDanhIdx = i;
  });

  return { nameIdx, chucVuIdx, chucDanhIdx };
}

function rowsToPeople(rows: string[][], startId: number): Person[] {
  if (rows.length < 2) return [];

  const headers = rows[0];
  const { nameIdx, chucVuIdx, chucDanhIdx } = mapHeaders(headers);

  if (nameIdx === -1) {
    throw new Error(
      'Không tìm thấy cột "Họ và Tên". Vui lòng kiểm tra tên cột trong file.'
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

/** Parse a CSV string into a 2D array. */
function parseCSV(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")));
}

/**
 * Parse an uploaded CSV or Excel file and return a list of Person objects.
 * @param file - The uploaded File object
 * @param startId - The starting ID for new people
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
