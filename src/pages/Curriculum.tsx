import { useState, useCallback } from "react";
import CurriculumOverview from "@/components/curriculum/CurriculumOverview";
import CurriculumSchedule from "@/components/curriculum/CurriculumSchedule";
import CurriculumAssessments from "@/components/curriculum/CurriculumAssessments";
import CurriculumHelpCenter from "@/components/curriculum/CurriculumHelpCenter";
import CurriculumKnowledgeBase from "@/components/curriculum/CurriculumKnowledgeBase";
import ChatAssistant from "@/components/ChatAssistant";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { useAuth } from "@/contexts/AuthContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, BookOpen, HelpCircle, FileText, Calendar, ClipboardCheck, Lock, Info } from "lucide-react";

export default function Curriculum() {
  const [verificationRequest, setVerificationRequest] = useState<{ fieldName: string; content: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { hasPermission, user } = useAuth();

  const canEdit = hasPermission('curriculum.edit');
  const canChat = hasPermission('chat.access');

  const handleVerify = useCallback((fieldName: string, content: string) => {
    setVerificationRequest({ fieldName, content });
  }, []);

  const handleVerificationHandled = useCallback(() => {
    setVerificationRequest(null);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] animate-fade-in">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={canChat ? 70 : 100} minSize={50}>
          <div className="h-full overflow-auto p-6">
            {/* Edit Mode Toggle - Only show if user can edit */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {user && (
                  <Badge variant="outline" className="text-xs">
                    {user.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
                  </Badge>
                )}
              </div>
              
              <PermissionGate 
                permission="curriculum.edit"
                fallback={
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Lock className="h-4 w-4" />
                    <span>Chế độ chỉ xem</span>
                  </div>
                }
              >
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
              </PermissionGate>
            </div>

            {!canEdit && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Bạn đang ở chế độ chỉ xem. Để chỉnh sửa nội dung, vui lòng liên hệ quản trị viên.
                </AlertDescription>
              </Alert>
            )}

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
                <CurriculumOverview isEditMode={isEditing && canEdit} />
              </TabsContent>
              <TabsContent value="schedule">
                <CurriculumSchedule />
              </TabsContent>
              <TabsContent value="assessments">
                <CurriculumAssessments />
              </TabsContent>
              <TabsContent value="help-center">
                <CurriculumHelpCenter isEditing={isEditing && canEdit} />
              </TabsContent>
              <TabsContent value="knowledge-base">
                <CurriculumKnowledgeBase isEditing={isEditing && canEdit} />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
        
        {canChat && (
          <>
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="h-full p-4">
                <ChatAssistant 
                  verificationRequest={verificationRequest}
                  onVerificationHandled={handleVerificationHandled}
                />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
