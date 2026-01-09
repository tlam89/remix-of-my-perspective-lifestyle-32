import { useState, useCallback } from "react";
import InitiativeReportForm from "@/components/InitiativeReportForm";
import InitiativeApplicationForm from "@/components/InitiativeApplicationForm";
import ContributionConfirmationForm from "@/components/ContributionConfirmationForm";
import InitiativeEvaluationForm from "@/components/InitiativeEvaluationForm";
import ChatAssistant from "@/components/ChatAssistant";
import { Lock } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [verificationRequest, setVerificationRequest] = useState<{ fieldName: string; content: string } | null>(null);
  
  // TODO: Replace with actual admin check from authentication system
  // For now, using a simple state to simulate admin access
  const [isAdmin] = useState(true); // This should come from auth context/user roles

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
              <TabsList className="mb-4 flex-wrap h-auto gap-1">
                <TabsTrigger value="report">Báo cáo Mô tả Sáng kiến</TabsTrigger>
                <TabsTrigger value="application">Đơn Đề nghị Công nhận</TabsTrigger>
                <TabsTrigger value="contribution">Xác nhận Tỷ lệ Đóng góp</TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="evaluation" className="gap-1">
                    <Lock size={14} />
                    Phiếu Đánh Giá
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="report">
                <InitiativeReportForm onVerify={handleVerify} />
              </TabsContent>
              <TabsContent value="application">
                <InitiativeApplicationForm onVerify={handleVerify} />
              </TabsContent>
              <TabsContent value="contribution">
                <ContributionConfirmationForm onVerify={handleVerify} />
              </TabsContent>
              {isAdmin && (
                <TabsContent value="evaluation">
                  <InitiativeEvaluationForm onVerify={handleVerify} />
                </TabsContent>
              )}
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
