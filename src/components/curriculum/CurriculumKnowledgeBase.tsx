import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  FileText,
  Pencil,
  Trash2,
  Eye,
  Download,
  Upload,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Document {
  id: string;
  name: string;
  description: string;
  status: "active" | "processing" | "draft";
  createdAt: Date;
  updatedAt: Date;
  type: string;
  size: string;
}

const initialDocuments: Document[] = [
  {
    id: "1",
    name: "Hướng dẫn viết TL.pdf",
    description: "Tài liệu hướng dẫn cách viết tiểu luận khoa học",
    status: "processing",
    createdAt: new Date(2026, 0, 13, 18, 52),
    updatedAt: new Date(2026, 0, 13, 18, 52),
    type: "PDF",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Quy định đánh giá sáng kiến.docx",
    description: "Các quy định và tiêu chí đánh giá sáng kiến",
    status: "active",
    createdAt: new Date(2026, 0, 10, 14, 30),
    updatedAt: new Date(2026, 0, 12, 9, 15),
    type: "DOCX",
    size: "1.2 MB",
  },
  {
    id: "3",
    name: "Mẫu đơn đăng ký.pdf",
    description: "Mẫu đơn đăng ký sáng kiến chuẩn",
    status: "active",
    createdAt: new Date(2026, 0, 5, 10, 0),
    updatedAt: new Date(2026, 0, 8, 16, 45),
    type: "PDF",
    size: "0.8 MB",
  },
  {
    id: "4",
    name: "Tài liệu tham khảo khóa học.pdf",
    description: "Tổng hợp tài liệu tham khảo cho khóa học",
    status: "draft",
    createdAt: new Date(2026, 0, 15, 11, 20),
    updatedAt: new Date(2026, 0, 15, 11, 20),
    type: "PDF",
    size: "5.6 MB",
  },
];

const statusConfig = {
  active: { label: "Hoạt động", variant: "default" as const, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  processing: { label: "Đang xử lý", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  draft: { label: "Bản nháp", variant: "outline" as const, className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
};

interface CurriculumKnowledgeBaseProps {
  isEditing?: boolean;
}

export default function CurriculumKnowledgeBase({ isEditing = false }: CurriculumKnowledgeBaseProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDoc, setNewDoc] = useState({
    name: "",
    description: "",
    type: "PDF",
    size: "0 KB",
  });

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDocument = () => {
    if (!newDoc.name.trim()) return;
    const doc: Document = {
      id: Date.now().toString(),
      name: newDoc.name,
      description: newDoc.description,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: newDoc.type,
      size: newDoc.size,
    };
    setDocuments([doc, ...documents]);
    setNewDoc({ name: "", description: "", type: "PDF", size: "0 KB" });
    setIsAddDialogOpen(false);
  };

  const handleUpdateDocument = () => {
    if (!editingDoc) return;
    setDocuments(
      documents.map((d) =>
        d.id === editingDoc.id ? { ...editingDoc, updatedAt: new Date() } : d
      )
    );
    setEditingDoc(null);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Hero */}
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-teal-700 to-cyan-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Kho Tài liệu</h1>
          <p className="text-teal-100">Quản lý và truy cập các tài liệu khóa học</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Tài liệu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm Tài liệu Mới</DialogTitle>
              <DialogDescription>
                Thêm tài liệu mới vào kho tài liệu của khóa học
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doc-name">Tên tài liệu</Label>
                <Input
                  id="doc-name"
                  placeholder="Nhập tên tài liệu..."
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-desc">Mô tả</Label>
                <Textarea
                  id="doc-desc"
                  placeholder="Mô tả ngắn về tài liệu..."
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Kéo thả file hoặc nhấn để tải lên
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hỗ trợ: PDF, DOCX, XLSX, PPTX (tối đa 10MB)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddDocument} disabled={!newDoc.name.trim()}>
                Thêm Tài liệu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Tên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Không tìm thấy tài liệu</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} • {doc.size}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[doc.status].className}>
                        {statusConfig[doc.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {format(doc.createdAt, "dd MMM, yyyy", { locale: vi })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(doc.createdAt, "HH:mm", { locale: vi })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        {isEditing && (
                          <>
                            <Dialog
                              open={editingDoc?.id === doc.id}
                              onOpenChange={(open) => !open && setEditingDoc(null)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingDoc(doc)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Chỉnh sửa Tài liệu</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Tên tài liệu</Label>
                                    <Input
                                      value={editingDoc?.name || ""}
                                      onChange={(e) =>
                                        setEditingDoc(
                                          editingDoc
                                            ? { ...editingDoc, name: e.target.value }
                                            : null
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Mô tả</Label>
                                    <Textarea
                                      value={editingDoc?.description || ""}
                                      onChange={(e) =>
                                        setEditingDoc(
                                          editingDoc
                                            ? { ...editingDoc, description: e.target.value }
                                            : null
                                        )
                                      }
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingDoc(null)}
                                  >
                                    Hủy
                                  </Button>
                                  <Button onClick={handleUpdateDocument}>
                                    Lưu thay đổi
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
