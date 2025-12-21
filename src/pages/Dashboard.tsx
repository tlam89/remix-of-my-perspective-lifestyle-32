import InitiativeReportForm from "@/components/InitiativeReportForm";
import ChatAssistant from "@/components/ChatAssistant";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Dashboard() {
  return (
    <div className="h-[calc(100vh-4rem)] animate-fade-in">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="h-full overflow-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Quản lý và đăng ký sáng kiến của bạn.
              </p>
            </div>
            <InitiativeReportForm />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full p-4">
            <ChatAssistant />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
