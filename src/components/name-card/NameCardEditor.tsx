import { useState, useEffect, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Plus, Trash2, RotateCcw, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import CardCanvas from "./CardCanvas";
import CardList from "./CardList";
import ControlPanel from "./ControlPanel";
import { renderCardToCtx } from "./canvas-utils";
import { parseNameListFile } from "./file-parser";
import { DEFAULT_CONFIG, INITIAL_PEOPLE } from "./constants";
import type { Person, CardConfig } from "./types";

const STORAGE_KEYS = {
  people: "namecard-people",
  config: "namecard-config",
  selectedId: "namecard-selectedId",
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function NameCardEditor() {
  const [people, setPeople] = useState<Person[]>(() => loadFromStorage(STORAGE_KEYS.people, INITIAL_PEOPLE));
  const [selectedId, setSelectedId] = useState(() => loadFromStorage(STORAGE_KEYS.selectedId, 1));
  const [config, setConfig] = useState<CardConfig>(() => loadFromStorage(STORAGE_KEYS.config, DEFAULT_CONFIG));
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listFileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);

  const selectedPerson = people.find((p) => p.id === selectedId);

  // Upload template handler
  const handleTemplateUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => setTemplateImage(img);
      img.src = URL.createObjectURL(file);
    },
    []
  );

  // Import people list from CSV/Excel
  const handleListFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const maxId = people.length > 0 ? Math.max(...people.map((p) => p.id)) : 0;
        const imported = await parseNameListFile(file, maxId + 1);
        if (imported.length === 0) {
          toast.error("File không chứa dữ liệu hợp lệ.");
          return;
        }
        setPeople(imported);
        setSelectedId(imported[0].id);
        toast.success(`Đã nhập ${imported.length} thẻ tên từ file.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Lỗi khi đọc file.");
      } finally {
        e.target.value = "";
      }
    },
    [people]
  );

  // Update a person
  const handlePersonChange = useCallback((updated: Person) => {
    setPeople((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  // Export single card as PNG
  const exportSingleCard = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !selectedPerson) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${selectedPerson.name.replace(/[.\s]+/g, "_")}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  }, [selectedPerson]);

  // Export all cards — fallback to individual downloads
  const exportAllCards = useCallback(async () => {
    if (!templateImage) return;
    setIsExporting(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      for (const person of people) {
        renderCardToCtx(ctx, templateImage, person, config);
        await new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (!blob) { resolve(); return; }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${String(person.id).padStart(2, "0")}_${person.name.replace(/[.\s]+/g, "_")}.png`;
            a.click();
            URL.revokeObjectURL(a.href);
            setTimeout(resolve, 500);
          }, "image/png");
        });
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
    setIsExporting(false);
  }, [templateImage, people, config]);

  // Add / Delete cards
  const addNewCard = useCallback(() => {
    const newId = Math.max(...people.map((p) => p.id)) + 1;
    const newPerson: Person = {
      id: newId,
      name: "Họ và Tên",
      chucVu: "Chức vụ",
      chucDanh: "THÀNH VIÊN",
    };
    setPeople((prev) => [...prev, newPerson]);
    setSelectedId(newId);
  }, [people]);

  const deleteCard = useCallback(() => {
    if (people.length <= 1) return;
    const remaining = people.filter((p) => p.id !== selectedId);
    setPeople(remaining);
    setSelectedId(remaining[0].id);
  }, [people, selectedId]);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.people, JSON.stringify(people)); }, [people]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.selectedId, JSON.stringify(selectedId)); }, [selectedId]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = people.findIndex((p) => p.id === selectedId);
      if (e.key === "ArrowDown" && idx < people.length - 1) {
        setSelectedId(people[idx + 1].id);
        e.preventDefault();
      }
      if (e.key === "ArrowUp" && idx > 0) {
        setSelectedId(people[idx - 1].id);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [people, selectedId]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-xl">Trình chỉnh sửa thẻ tên</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Tải template
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleTemplateUpload}
              className="hidden"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {!templateImage ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Upload className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Vui lòng tải lên ảnh template thẻ tên để bắt đầu
            </p>
            <Button
              variant="default"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Chọn ảnh template
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* LEFT: Card List */}
            <aside className="w-full lg:w-[250px] border-b lg:border-b-0 lg:border-r border-border flex flex-col shrink-0">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold text-primary">
                  Danh sách thẻ tên
                </h3>
                <p className="text-[10.5px] text-muted-foreground mt-0.5">
                  {people.length} thẻ · Dùng ↑↓ để chuyển
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 max-h-[300px] lg:max-h-none">
                <CardList
                  people={people}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
              <div className="p-2.5 border-t border-border space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => listFileInputRef.current?.click()}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" />
                  Nhập từ Excel/CSV
                </Button>
                <input
                  ref={listFileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleListFileUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={addNewCard}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={deleteCard}
                    disabled={people.length <= 1}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </aside>

            {/* CENTER: Preview */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto bg-muted/30">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  Thẻ {people.findIndex((p) => p.id === selectedId) + 1} /{" "}
                  {people.length}
                </span>
              </div>

              {selectedPerson && (
                <CardCanvas
                  templateImage={templateImage}
                  person={selectedPerson}
                  config={config}
                  canvasRef={previewCanvasRef}
                />
              )}

              <div className="mt-4 flex gap-2 flex-wrap justify-center">
                <Button size="sm" onClick={exportSingleCard}>
                  <Download className="w-4 h-4 mr-1" />
                  Xuất thẻ này
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={exportAllCards}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {isExporting
                    ? "Đang xuất..."
                    : `Xuất tất cả ${people.length} thẻ`}
                </Button>
              </div>
            </main>

            {/* RIGHT: Controls */}
            <aside className="w-full lg:w-[280px] border-t lg:border-t-0 lg:border-l border-border overflow-y-auto p-4 shrink-0">
              <h3 className="text-sm font-bold text-primary mb-0.5">
                Chỉnh sửa thẻ
              </h3>
              <p className="text-[10.5px] text-muted-foreground mb-3">
                Thay đổi áp dụng trực tiếp
              </p>

              {selectedPerson && (
                <ControlPanel
                  person={selectedPerson}
                  config={config}
                  onPersonChange={handlePersonChange}
                  onConfigChange={setConfig}
                />
              )}

              <div className="mt-6 pt-3.5 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setConfig(DEFAULT_CONFIG)}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Đặt lại mặc định
                </Button>
              </div>
            </aside>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
