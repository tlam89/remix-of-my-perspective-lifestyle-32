import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  isVerification?: boolean;
  fieldName?: string;
}

interface ChatAssistantProps {
  verificationRequest?: { fieldName: string; content: string } | null;
  onVerificationHandled?: () => void;
}

export default function ChatAssistant({ verificationRequest, onVerificationHandled }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Xin chào! Tôi là Trợ lý Sáng kiến. Tôi có thể giúp bạn kiểm tra nội dung các mục trong đơn đăng ký sáng kiến hoặc giải đáp thắc mắc về quy trình. Bạn cần hỗ trợ gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle verification requests from the form
  useEffect(() => {
    if (verificationRequest) {
      const verifyMessage: Message = {
        id: Date.now(),
        role: "user",
        content: `[Kiểm tra nội dung: ${verificationRequest.fieldName}]\n\n"${verificationRequest.content}"`,
        isVerification: true,
        fieldName: verificationRequest.fieldName,
      };

      setMessages((prev) => [...prev, verifyMessage]);

      // Simulate assistant verification response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: `Tôi đã kiểm tra nội dung phần "${verificationRequest.fieldName}".\n\n✅ Nội dung phù hợp với yêu cầu.\n\nMột số góp ý:\n• Nội dung rõ ràng và mạch lạc\n• Đảm bảo tuân thủ quy định về sáng kiến\n• Có thể bổ sung thêm số liệu cụ thể nếu có`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        onVerificationHandled?.();
      }, 1500);
    }
  }, [verificationRequest, onVerificationHandled]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Cảm ơn bạn đã đặt câu hỏi. Tôi đang xử lý yêu cầu của bạn...",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-primary/5">
        <div className="p-2 rounded-full bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Trợ lý Sáng kiến</h3>
          <p className="text-xs text-muted-foreground">Hỗ trợ kiểm tra & tư vấn</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="p-1.5 rounded-full bg-primary/10 h-fit">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? message.isVerification
                      ? "bg-secondary text-secondary-foreground border border-primary/30"
                      : "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.isVerification && (
                  <div className="flex items-center gap-1 text-xs text-primary mb-1">
                    <CheckCircle2 size={12} />
                    <span>Yêu cầu kiểm tra</span>
                  </div>
                )}
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="p-1.5 rounded-full bg-secondary h-fit">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
