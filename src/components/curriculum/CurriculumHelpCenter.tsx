import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Search, Plus, Pencil, Trash2, Check, X, GripVertical } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  items: FAQItem[];
}

const initialSections: FAQSection[] = [
  {
    id: "1",
    title: "Bắt đầu",
    items: [
      {
        id: "1-1",
        question: "Làm thế nào để đăng ký khóa học?",
        answer: "Bạn có thể đăng ký khóa học thông qua cổng sinh viên. Vào mục 'Đăng ký môn học', tìm kiếm khóa học và nhấn 'Đăng ký'.",
      },
      {
        id: "1-2",
        question: "Yêu cầu tiên quyết cho khóa học là gì?",
        answer: "Khóa học này không yêu cầu điều kiện tiên quyết. Được thiết kế cho sinh viên năm nhất và mọi cấp độ.",
      },
    ],
  },
  {
    id: "2",
    title: "Xây dựng Trợ lý Giảng dạy AI",
    items: [
      {
        id: "2-1",
        question: "Trợ lý AI hỗ trợ những gì?",
        answer: "Trợ lý AI có thể giúp bạn kiểm tra nội dung đơn, trả lời câu hỏi về quy trình, và cung cấp hướng dẫn về chương trình giảng dạy.",
      },
      {
        id: "2-2",
        question: "Làm sao để tương tác với Trợ lý AI?",
        answer: "Bạn có thể gõ câu hỏi vào ô chat bên phải màn hình. Trợ lý sẽ phản hồi ngay lập tức.",
      },
    ],
  },
  {
    id: "3",
    title: "Quản lý Chủ đề Hướng dẫn",
    items: [
      {
        id: "3-1",
        question: "Làm thế nào để thêm chủ đề mới?",
        answer: "Vào tab 'Lịch trình Học tập' và nhấn nút 'Chỉnh sửa' để bật chế độ chỉnh sửa. Sau đó bạn có thể thêm, sửa hoặc xóa các chủ đề.",
      },
    ],
  },
  {
    id: "4",
    title: "Tương tác với Người học",
    items: [
      {
        id: "4-1",
        question: "Làm sao để theo dõi tiến độ sinh viên?",
        answer: "Sử dụng tab 'Đánh giá & Kiểm tra' để xem chi tiết các bài đánh giá và theo dõi tiến độ học tập.",
      },
    ],
  },
  {
    id: "5",
    title: "Tạo và Quản lý Nhóm",
    items: [
      {
        id: "5-1",
        question: "Làm thế nào để tạo nhóm học tập?",
        answer: "Tính năng quản lý nhóm sẽ sớm được cập nhật. Hiện tại bạn có thể liên hệ quản trị viên để được hỗ trợ.",
      },
    ],
  },
  {
    id: "6",
    title: "Phân tích và Theo dõi Tác động",
    items: [
      {
        id: "6-1",
        question: "Báo cáo phân tích bao gồm những gì?",
        answer: "Báo cáo phân tích bao gồm: tỷ lệ hoàn thành, điểm trung bình, thời gian học tập, và xu hướng tiến độ theo thời gian.",
      },
    ],
  },
];

interface CurriculumHelpCenterProps {
  isEditing?: boolean;
}

export default function CurriculumHelpCenter({ isEditing = false }: CurriculumHelpCenterProps) {
  const [sections, setSections] = useState<FAQSection[]>(initialSections);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newItemData, setNewItemData] = useState({ question: "", answer: "" });
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0 || searchQuery === "");

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection: FAQSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      items: [],
    };
    setSections([...sections, newSection]);
    setNewSectionTitle("");
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const handleUpdateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s))
    );
    setEditingSection(null);
  };

  const handleAddItem = (sectionId: string) => {
    if (!newItemData.question.trim() || !newItemData.answer.trim()) return;
    const newItem: FAQItem = {
      id: `${sectionId}-${Date.now()}`,
      question: newItemData.question,
      answer: newItemData.answer,
    };
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      )
    );
    setNewItemData({ question: "", answer: "" });
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
          : s
      )
    );
  };

  const handleUpdateItem = (
    sectionId: string,
    itemId: string,
    question: string,
    answer: string
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((i) =>
                i.id === itemId ? { ...i, question, answer } : i
              ),
            }
          : s
      )
    );
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Hero */}
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-teal-600 to-teal-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Trung tâm Hỗ trợ</h1>
          <p className="text-teal-100">Tìm câu trả lời cho các câu hỏi thường gặp</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm câu hỏi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add New Section (Edit Mode) */}
      {isEditing && (
        <Card className="border-dashed border-2 border-primary/30">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tên mục mới..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
              <Button onClick={handleAddSection} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Thêm Mục
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                {editingSection === section.id ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      defaultValue={section.title}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateSectionTitle(section.id, e.currentTarget.value);
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingSection(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {isEditing && (
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    )}
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {section.title}
                    <Badge variant="secondary" className="ml-2">
                      {section.items.length}
                    </Badge>
                  </CardTitle>
                )}
                {isEditing && editingSection !== section.id && (
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingSection(section.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    {editingItem === item.id ? (
                      <div className="py-4 space-y-3 border-b">
                        <Input
                          defaultValue={item.question}
                          id={`q-${item.id}`}
                          placeholder="Câu hỏi"
                        />
                        <Textarea
                          defaultValue={item.answer}
                          id={`a-${item.id}`}
                          placeholder="Trả lời"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const q = (document.getElementById(`q-${item.id}`) as HTMLInputElement)?.value;
                              const a = (document.getElementById(`a-${item.id}`) as HTMLTextAreaElement)?.value;
                              handleUpdateItem(section.id, item.id, q, a);
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Lưu
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingItem(null)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <AccordionTrigger className="hover:no-underline text-left">
                          <div className="flex items-center gap-2 flex-1">
                            {item.question}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-muted-foreground">{item.answer}</p>
                            {isEditing && (
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingItem(item.id)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem(section.id, item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Add New Item (Edit Mode) */}
              {isEditing && (
                <div className="mt-4 pt-4 border-t border-dashed space-y-3">
                  <Input
                    placeholder="Câu hỏi mới..."
                    value={newItemData.question}
                    onChange={(e) =>
                      setNewItemData({ ...newItemData, question: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Trả lời..."
                    value={newItemData.answer}
                    onChange={(e) =>
                      setNewItemData({ ...newItemData, answer: e.target.value })
                    }
                    rows={2}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddItem(section.id)}
                    disabled={!newItemData.question.trim() || !newItemData.answer.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm Câu hỏi
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
