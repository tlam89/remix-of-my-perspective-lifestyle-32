import { useState, useCallback } from "react";
import InitiativeReportForm from "@/components/InitiativeReportForm";
import InitiativeApplicationForm from "@/components/InitiativeApplicationForm";
import ContributionConfirmationForm from "@/components/ContributionConfirmationForm";
import InitiativeEvaluationForm from "@/components/InitiativeEvaluationForm";
import ChatAssistant from "@/components/ChatAssistant";
import { Lock, Eye, Edit3 } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [verificationRequest, setVerificationRequest] = useState<{ fieldName: string; content: string } | null>(null);
  const { hasPermission } = useAuth();
  
  // Permission checks
  const canViewEvaluation = hasPermission('evaluation.view'); // Admin & Editor
  const canViewChat = hasPermission('chat.view');             // Admin & Editor (not Viewer)
  const canInteractChat = hasPermission('chat.interact');     // Admin only (full chat)
  const canVerify = hasPermission('application.verify');      // Admin only
  const canEditApplication = hasPermission('application.edit'); // Viewer only
  const isViewOnly = !canEditApplication && hasPermission('application.view'); // Editor & Admin view only

  const handleVerify = useCallback((fieldName: string, content: string) => {
    if (canVerify) {
      setVerificationRequest({ fieldName, content });
    }
  }, [canVerify]);

  const handleVerificationHandled = useCallback(() => {
    setVerificationRequest(null);
  }, []);

  // Determine panel sizes based on chat visibility
  const mainPanelSize = canViewChat ? 70 : 100;
  const chatPanelSize = canViewChat ? 30 : 0;

  return (
    <div className="h-[calc(100vh-4rem)] animate-fade-in">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={mainPanelSize} minSize={50}>
          <div className="h-full overflow-auto p-6">
            {/* Mode indicator */}
            <div className="mb-4 flex items-center gap-2">
              {isViewOnly ? (
                <Badge variant="secondary" className="gap-1">
                  <Eye size={14} />
                  Chế độ Xem
                </Badge>
              ) : canEditApplication ? (
                <Badge variant="default" className="gap-1">
                  <Edit3 size={14} />
                  Chế độ Chỉnh sửa
                </Badge>
              ) : null}
            </div>

            <Tabs defaultValue="report" className="w-full">
              <TabsList className="mb-4 flex-wrap h-auto gap-1">
                <TabsTrigger value="report">Báo cáo Mô tả Sáng kiến</TabsTrigger>
                <TabsTrigger value="application">Đơn Đề nghị Công nhận</TabsTrigger>
                <TabsTrigger value="contribution">Xác nhận Tỷ lệ Đóng góp</TabsTrigger>
                {canViewEvaluation && (
                  <TabsTrigger value="evaluation" className="gap-1">
                    <Lock size={14} />
                    Phiếu Đánh Giá
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="report">
                <InitiativeReportForm 
                  onVerify={canVerify ? handleVerify : undefined}
                  readOnly={isViewOnly}
                  showVerifyButton={canVerify}
                />
              </TabsContent>
              <TabsContent value="application">
                <InitiativeApplicationForm 
                  onVerify={canVerify ? handleVerify : undefined}
                  readOnly={isViewOnly}
                  showVerifyButton={canVerify}
                />
              </TabsContent>
              <TabsContent value="contribution">
                <ContributionConfirmationForm 
                  onVerify={canVerify ? handleVerify : undefined}
                  readOnly={isViewOnly}
                  showVerifyButton={canVerify}
                />
              </TabsContent>
              {canViewEvaluation && (
                <TabsContent value="evaluation">
                  <InitiativeEvaluationForm onVerify={canVerify ? handleVerify : undefined} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ResizablePanel>
        
        {canViewChat && (
          <>
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={chatPanelSize} minSize={20}>
              <div className="h-full p-4">
                <ChatAssistant 
                  verificationRequest={verificationRequest}
                  onVerificationHandled={handleVerificationHandled}
                  readOnly={!canInteractChat}
                />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
