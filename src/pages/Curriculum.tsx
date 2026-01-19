import { useState, useCallback } from "react";
import CurriculumOverview from "@/components/curriculum/CurriculumOverview";
import CurriculumSchedule from "@/components/curriculum/CurriculumSchedule";
import CurriculumAssessments from "@/components/curriculum/CurriculumAssessments";
import CurriculumHelpCenter from "@/components/curriculum/CurriculumHelpCenter";
import CurriculumKnowledgeBase from "@/components/curriculum/CurriculumKnowledgeBase";
import ChatAssistant from "@/components/ChatAssistant";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil, BookOpen, HelpCircle, FileText, Calendar, ClipboardCheck } from "lucide-react";

export default function Curriculum() {
  const [verificationRequest, setVerificationRequest] = useState<{ fieldName: string; content: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleVerify = useCallback((fieldName: string, content: string) => {
    setVerificationRequest({ fieldName, content });
  }, []);

  const handleVerificationHandled = useCallback(() => {
    setVerificationRequest(null);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] animate-fade-in">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="h-full overflow-auto p-6">
            {/* Edit Mode Toggle */}
            <div className="flex items-center justify-end gap-2 mb-4">
              <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
                <Switch
                  id="edit-mode"
                  checked={isEditing}
                  onCheckedChange={setIsEditing}
                />
                <Label htmlFor="edit-mode" className="flex items-center gap-2 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  Chế độ Chỉnh sửa
                </Label>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4 flex-wrap h-auto gap-1">
                <TabsTrigger value="overview" className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  Tổng quan Khóa học
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Lịch trình Học tập
                </TabsTrigger>
                <TabsTrigger value="assessments" className="flex items-center gap-1.5">
                  <ClipboardCheck className="h-4 w-4" />
                  Đánh giá & Kiểm tra
                </TabsTrigger>
                <TabsTrigger value="help-center" className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  Trung tâm Hỗ trợ
                </TabsTrigger>
                <TabsTrigger value="knowledge-base" className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Kho Tài liệu
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <CurriculumOverview />
              </TabsContent>
              <TabsContent value="schedule">
                <CurriculumSchedule />
              </TabsContent>
              <TabsContent value="assessments">
                <CurriculumAssessments />
              </TabsContent>
              <TabsContent value="help-center">
                <CurriculumHelpCenter isEditing={isEditing} />
              </TabsContent>
              <TabsContent value="knowledge-base">
                <CurriculumKnowledgeBase isEditing={isEditing} />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full p-4">
            <ChatAssistant 
              verificationRequest={verificationRequest}
              onVerificationHandled={handleVerificationHandled}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
