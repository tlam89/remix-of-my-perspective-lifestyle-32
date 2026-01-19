import { useState, useCallback } from "react";
import CurriculumOverview from "@/components/curriculum/CurriculumOverview";
import CurriculumSchedule from "@/components/curriculum/CurriculumSchedule";
import CurriculumAssessments from "@/components/curriculum/CurriculumAssessments";
import ChatAssistant from "@/components/ChatAssistant";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Curriculum() {
  const [verificationRequest, setVerificationRequest] = useState<{ fieldName: string; content: string } | null>(null);

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
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4 flex-wrap h-auto gap-1">
                <TabsTrigger value="overview">Tổng quan Khóa học</TabsTrigger>
                <TabsTrigger value="schedule">Lịch trình Học tập</TabsTrigger>
                <TabsTrigger value="assessments">Đánh giá & Kiểm tra</TabsTrigger>
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
