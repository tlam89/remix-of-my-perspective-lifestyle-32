import { useState, useCallback } from "react";
import InitiativeReportForm from "@/components/InitiativeReportForm";
import InitiativeApplicationForm from "@/components/InitiativeApplicationForm";
import ChatAssistant from "@/components/ChatAssistant";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
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
            
            <Tabs defaultValue="report" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="report">Báo cáo Mô tả Sáng kiến</TabsTrigger>
                <TabsTrigger value="application">Đơn Đề nghị Công nhận</TabsTrigger>
              </TabsList>
              <TabsContent value="report">
                <InitiativeReportForm onVerify={handleVerify} />
              </TabsContent>
              <TabsContent value="application">
                <InitiativeApplicationForm onVerify={handleVerify} />
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
