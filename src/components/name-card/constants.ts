import type { CardConfig, Person } from "./types";

export const NAVY = "#f9b342";

export const DEFAULT_CONFIG: CardConfig = {
  zoneTop: 520,
  zoneBottom: 850,
  gapRoleName: 26,
  gapNamePos: 18,
  fontSizeRole: 43,
  fontSizeName: 43,
  fontSizePos: 43,
  textColor: "#f9b342",
  fontFamilyRole: "'Roboto', Helvetica, Arial, sans-serif",
  fontFamilyName: "'Roboto', Helvetica, Arial, sans-serif",
  fontFamilyPos: "'Roboto', Helvetica, Arial, sans-serif",
};

export const INITIAL_PEOPLE: Person[] = [
  { id: 1, name: "PGS.TS. Nguyễn Văn Chinh", chucVu: "Phó Hiệu trưởng", chucDanh: "TRƯỞNG BAN" },
  { id: 2, name: "PGS.TS. Vương Thị Ngọc Lan", chucVu: "Phó Hiệu trưởng", chucDanh: "PHÓ TRƯỞNG BAN" },
  { id: 3, name: "PGS.TS. Trần Ngọc Đăng", chucVu: "Phó Trưởng Phòng KHCN", chucDanh: "PHÓ TRƯỞNG BAN" },
  { id: 4, name: "TS.BS. Đặng Nguyễn Trung An", chucVu: "Trưởng Phòng HCTH", chucDanh: "THÀNH VIÊN" },
  { id: 5, name: "ThS. Trương Thị Thùy Trang", chucVu: "Trưởng Phòng KHTC", chucDanh: "THÀNH VIÊN" },
  { id: 6, name: "ThS. Vương Hữu Mẫn", chucVu: "Điều hành Phòng QTGT", chucDanh: "THÀNH VIÊN" },
  { id: 7, name: "PGS.TS. Đỗ Thị Hồng Tươi", chucVu: "Trưởng Phòng TCCB", chucDanh: "THÀNH VIÊN" },
  { id: 8, name: "TS. Huỳnh Hồ Ngọc Quỳnh", chucVu: "Trưởng Phòng CTSV", chucDanh: "THÀNH VIÊN" },
  { id: 9, name: "PGS.TS. Nguyễn Đức Hạnh", chucVu: "Trưởng Phòng HTQT", chucDanh: "THÀNH VIÊN" },
];
