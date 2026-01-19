import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, PenTool, Users, BookOpen, Lightbulb } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const assessmentDetails = [
  {
    title: "Bài kiểm tra Tuần",
    icon: CheckCircle2,
    weight: "20%",
    description: "Bài kiểm tra ngắn, trực tuyến hoặc tại lớp (10-15 câu hỏi) để kiểm tra mức độ hiểu bài.",
    details: [
      "Tập trung vào câu hỏi trắc nghiệm và trả lời ngắn",
      "Được thực hiện hàng tuần vào cuối mỗi buổi học",
      "Bao gồm nội dung từ bài giảng và bài đọc",
    ],
  },
  {
    title: "Kỳ thi/Bài luận Giữa kỳ",
    icon: PenTool,
    weight: "20%",
    description: "Bài luận hoặc kỳ thi kết hợp các đơn vị 1-6.",
    details: [
      "Ví dụ: 'Thảo luận cách triết học ảnh hưởng đến khoa học hiện đại'",
      "Yêu cầu tổng hợp kiến thức từ nhiều đơn vị",
      "Có thể chọn giữa bài thi tại lớp hoặc bài luận về nhà",
    ],
  },
  {
    title: "Dự án Cuối kỳ",
    icon: Lightbulb,
    weight: "25%",
    description: "Bài luận hoặc thuyết trình liên ngành.",
    details: [
      "Ví dụ: 'Đề xuất giải pháp cho một vấn đề toàn cầu sử dụng khái niệm từ ba ngành'",
      "Thang điểm: 40% nội dung, 30% phân tích, 20% sáng tạo, 10% trình bày",
      "Có thể làm việc cá nhân hoặc nhóm (tối đa 3 người)",
    ],
  },
  {
    title: "Nhật ký Phản ánh",
    icon: BookOpen,
    weight: "15%",
    description: "Nhật ký 1-2 trang được nộp định kỳ.",
    details: [
      "Chấm điểm dựa trên độ sâu và kết nối với tài liệu khóa học",
      "3 bài nộp trong suốt học kỳ (5% mỗi bài)",
      "Khuyến khích phản ánh cá nhân và liên hệ thực tế",
    ],
  },
  {
    title: "Tham gia và Thảo luận",
    icon: Users,
    weight: "20%",
    description: "Dựa trên điểm danh, đóng góp và sự tôn trọng trong thảo luận.",
    details: [
      "Đánh giá chất lượng đóng góp, không chỉ số lượng",
      "Bao gồm cả thảo luận trực tiếp và trực tuyến",
      "Tôn trọng quan điểm đa dạng là tiêu chí quan trọng",
    ],
  },
];

const implementationTips = [
  {
    title: "Tính Bao trùm",
    description: "Kết hợp các quan điểm đa dạng (ví dụ: tác giả toàn cầu) và điều chỉnh cho các phong cách học tập khác nhau.",
  },
  {
    title: "Tính Linh hoạt",
    description: "Xây dựng các tuần đệm cho các sự kiện hiện tại hoặc phản hồi của sinh viên.",
  },
  {
    title: "Đánh giá",
    description: "Sử dụng khảo sát sinh viên giữa học kỳ để điều chỉnh.",
  },
  {
    title: "Tài nguyên cho Giảng viên",
    description: "Nếu giảng dạy khóa học này, hãy xem xét các công cụ như Canvas hoặc Moodle cho các thành phần trực tuyến.",
  },
];

export default function CurriculumAssessments() {
  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chi tiết Đánh giá
          </CardTitle>
          <CardDescription>
            Hệ thống đánh giá được thiết kế để đo lường nhiều khía cạnh của việc học tập
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {assessmentDetails.map((assessment, index) => (
            <div key={index}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <assessment.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{assessment.title}</h3>
                    <Badge variant="secondary">{assessment.weight}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                  <ul className="space-y-1">
                    {assessment.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < assessmentDetails.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rubric Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Thang điểm Dự án Cuối kỳ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-primary">40%</p>
              <p className="text-sm text-muted-foreground">Nội dung</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-primary">30%</p>
              <p className="text-sm text-muted-foreground">Phân tích</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-primary">20%</p>
              <p className="text-sm text-muted-foreground">Sáng tạo</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-primary">10%</p>
              <p className="text-sm text-muted-foreground">Trình bày</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Gợi ý Triển khai</CardTitle>
          <CardDescription>
            Các mẹo để triển khai chương trình giảng dạy hiệu quả
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {implementationTips.map((tip, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
