import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Users, FileCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WeekData {
  week: number;
  topic: string;
  unit?: string;
  readings: string;
  activities: string;
  assessments: string;
}

const weeklySchedule: WeekData[] = [
  {
    week: 1,
    topic: "Nhập môn Nghệ thuật Tự do: Kiến thức là gì?",
    unit: "Giới thiệu",
    readings: "Xem xét giáo trình; trích đoạn từ 'The Republic' của Plato",
    activities: "Thảo luận phá băng: 'Tại sao học rộng?'",
    assessments: "Bài kiểm tra giáo trình (không tính điểm)",
  },
  {
    week: 2,
    topic: "Nhân văn: Văn học và Triết học",
    unit: "Nhân văn",
    readings: "Truyện ngắn của Kafka; TED Talk về đạo đức",
    activities: "Phân tích nhóm về một tình huống triết học",
    assessments: "Bài kiểm tra tuần (5%)",
  },
  {
    week: 3,
    topic: "Nhân văn: Lịch sử và Văn hóa",
    unit: "Nhân văn",
    readings: "Chương về lịch sử Phục hưng; tham quan bảo tàng ảo",
    activities: "Hoạt động tạo dòng thời gian",
    assessments: "Tham gia thảo luận",
  },
  {
    week: 4,
    topic: "Khoa học Xã hội: Xã hội học và Tâm lý học",
    unit: "Khoa học Xã hội",
    readings: "Trích đoạn từ Freud và Durkheim",
    activities: "Đóng vai các kịch bản xã hội",
    assessments: "Nhật ký phản ánh #1 (5%)",
  },
  {
    week: 5,
    topic: "Khoa học Xã hội: Kinh tế và Chính trị",
    unit: "Khoa học Xã hội",
    readings: "Nguyên lý kinh tế cơ bản (video Khan Academy)",
    activities: "Tranh luận về bất bình đẳng",
    assessments: "Bài kiểm tra tuần",
  },
  {
    week: 6,
    topic: "Khoa học Tự nhiên: Sinh học và Môi trường",
    unit: "Khoa học Tự nhiên",
    readings: "Nhập môn tiến hóa; bài viết về biến đổi khí hậu",
    activities: "Thí nghiệm đơn giản (quan sát hệ sinh thái qua ứng dụng)",
    assessments: "Chuẩn bị giữa kỳ",
  },
  {
    week: 7,
    topic: "Khoa học Tự nhiên: Vật lý và Công nghệ",
    unit: "Khoa học Tự nhiên",
    readings: "Định luật Newton; video về đạo đức AI",
    activities: "Diễn giả khách mời (nhà khoa học hoặc chuyên gia đạo đức)",
    assessments: "Kỳ thi/bài luận giữa kỳ (20%)",
  },
  {
    week: 8,
    topic: "Nghệ thuật: Thị giác và Biểu diễn",
    unit: "Nghệ thuật",
    readings: "Tổng quan lịch sử nghệ thuật; phân tích một bức tranh",
    activities: "Tạo tác phẩm nghệ thuật hoặc biểu diễn đơn giản",
    assessments: "Thảo luận",
  },
  {
    week: 9,
    topic: "Nghệ thuật: Âm nhạc và Truyền thông",
    unit: "Nghệ thuật",
    readings: "Cơ bản lý thuyết âm nhạc; phê bình đoạn phim",
    activities: "Dự án tuyển chọn danh sách phát",
    assessments: "Bài kiểm tra tuần",
  },
  {
    week: 10,
    topic: "Kết nối Liên ngành: Khoa học và Xã hội",
    unit: "Liên ngành",
    readings: "Nghiên cứu tình huống về đạo đức sinh học (ví dụ: CRISPR)",
    activities: "Chuẩn bị thuyết trình nhóm",
    assessments: "Nhật ký phản ánh #2 (5%)",
  },
  {
    week: 11,
    topic: "Kết nối Liên ngành: Nghệ thuật và Chính trị",
    unit: "Liên ngành",
    readings: "Ví dụ nghệ thuật phản kháng",
    activities: "Tranh luận về kiểm duyệt",
    assessments: "Tham gia",
  },
  {
    week: 12,
    topic: "Quan điểm Toàn cầu: Văn hóa và Toàn cầu hóa",
    unit: "Toàn cầu",
    readings: "Bài đọc về chủ nghĩa tương đối văn hóa",
    activities: "Hoạt động 'trao đổi văn hóa' ảo",
    assessments: "Bài kiểm tra tuần",
  },
  {
    week: 13,
    topic: "Đạo đức và Phát triển Cá nhân",
    unit: "Tổng hợp",
    readings: "Các tình huống đạo đức hiện đại (ví dụ: quyền AI)",
    activities: "Hội thảo tự phản ánh",
    assessments: "Xem xét bản nháp dự án cuối kỳ",
  },
  {
    week: 14,
    topic: "Ôn tập và Tổng hợp",
    unit: "Tổng hợp",
    readings: "Tóm tắt tất cả các đơn vị",
    activities: "Phản hồi đồng nghiệp về dự án",
    assessments: "Nhật ký phản ánh #3 (5%)",
  },
  {
    week: 15,
    topic: "Thuyết trình Cuối kỳ và Kết thúc",
    unit: "Kết thúc",
    readings: "N/A",
    activities: "Thuyết trình do sinh viên dẫn dắt",
    assessments: "Dự án cuối kỳ (25%)",
  },
];

const unitColors: Record<string, string> = {
  "Giới thiệu": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Nhân văn": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Khoa học Xã hội": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Khoa học Tự nhiên": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Nghệ thuật": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "Liên ngành": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "Toàn cầu": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "Tổng hợp": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Kết thúc": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function CurriculumSchedule() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lịch trình 15 Tuần
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Tuần</TableHead>
                  <TableHead>Chủ đề/Đơn vị</TableHead>
                  <TableHead>Bài đọc/Tài liệu</TableHead>
                  <TableHead>Hoạt động/Bài tập</TableHead>
                  <TableHead>Đánh giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklySchedule.map((week) => (
                  <TableRow key={week.week}>
                    <TableCell className="font-medium">{week.week}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{week.topic}</p>
                        {week.unit && (
                          <Badge className={unitColors[week.unit] || ""}>{week.unit}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{week.readings}</TableCell>
                    <TableCell className="text-sm">{week.activities}</TableCell>
                    <TableCell className="text-sm">{week.assessments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Accordion View */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible className="w-full">
              {weeklySchedule.map((week) => (
                <AccordionItem key={week.week} value={`week-${week.week}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {week.week}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{week.topic}</p>
                        {week.unit && (
                          <Badge className={`${unitColors[week.unit] || ""} mt-1`} variant="secondary">
                            {week.unit}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 space-y-3">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Bài đọc</p>
                        <p className="text-sm">{week.readings}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Hoạt động</p>
                        <p className="text-sm">{week.activities}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileCheck className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Đánh giá</p>
                        <p className="text-sm">{week.assessments}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
