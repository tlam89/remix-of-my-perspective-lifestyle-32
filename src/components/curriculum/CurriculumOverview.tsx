import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, GraduationCap, Target, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const learningObjectives = [
  "Xác định các khái niệm cốt lõi từ nhiều ngành và giải thích mối liên kết của chúng.",
  "Phân tích văn bản, dữ liệu và tác phẩm nghệ thuật một cách có phê phán.",
  "Áp dụng lý luận đạo đức vào các vấn đề đương đại.",
  "Giao tiếp ý tưởng hiệu quả thông qua viết và thảo luận.",
  "Phản ánh về sự phát triển cá nhân và giá trị của việc học tập suốt đời.",
];

const teachingMethods = [
  { method: "Giảng dạy", percentage: 50, description: "Tổng quan do giảng viên hướng dẫn với đa phương tiện" },
  { method: "Thảo luận/Hội thảo", percentage: 30, description: "Tranh luận nhóm nhỏ và tương tác đồng nghiệp" },
  { method: "Hoạt động", percentage: 20, description: "Dự án thực hành, diễn giả khách mời hoặc tham quan thực địa" },
];

const gradingBreakdown = [
  { item: "Tham gia và Thảo luận", weight: 20 },
  { item: "Bài kiểm tra (hàng tuần)", weight: 20 },
  { item: "Kỳ thi/Bài luận Giữa kỳ", weight: 20 },
  { item: "Dự án Cuối kỳ", weight: 25 },
  { item: "Nhật ký Phản ánh", weight: 15 },
];

export default function CurriculumOverview() {
  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Giáo dục Đại cương</Badge>
            <Badge variant="outline">3 Tín chỉ</Badge>
          </div>
          <CardTitle className="text-2xl">
            Nhập môn Nghệ thuật Tự do: Khám phá Kiến thức Liên ngành
          </CardTitle>
          <CardDescription className="text-base">
            Khóa học này cung cấp cái nhìn tổng quan nền tảng về các ý tưởng chính trong nhân văn, 
            khoa học xã hội, khoa học tự nhiên và nghệ thuật. Sinh viên sẽ khám phá cách các lĩnh vực 
            khác nhau kết nối với nhau, phát triển kỹ năng tư duy phê phán và áp dụng các khái niệm 
            vào các vấn đề thực tế.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Thời lượng</p>
                <p className="font-medium">15 Tuần</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Đối tượng</p>
                <p className="font-medium">Sinh viên năm nhất</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Hình thức</p>
                <p className="font-medium">Kết hợp</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Điều kiện tiên quyết</p>
                <p className="font-medium">Không có</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mục tiêu Học tập
          </CardTitle>
          <CardDescription>
            Kết thúc khóa học, sinh viên sẽ có khả năng:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {learningObjectives.map((objective, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span>{objective}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Teaching Methods & Grading */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phương pháp Giảng dạy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teachingMethods.map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{method.method}</span>
                  <span className="text-muted-foreground">{method.percentage}%</span>
                </div>
                <Progress value={method.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bổ Điểm số</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gradingBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.item}</span>
                  <Badge variant="secondary">{item.weight}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Required Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tài liệu Bắt buộc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Sách giáo khoa</p>
                <p className="text-sm text-muted-foreground">
                  "The Making of the Modern World" của Richard Hooker (hoặc tuyển tập tương tự)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Tài nguyên Trực tuyến</p>
                <p className="text-sm text-muted-foreground">
                  Truy cập miễn phí JSTOR, Khan Academy hoặc TED Talks
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Dụng cụ</p>
                <p className="text-sm text-muted-foreground">
                  Sổ ghi chép để phản ánh; truy cập máy tính cho bài tập
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
