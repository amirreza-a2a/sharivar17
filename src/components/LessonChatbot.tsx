import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, X } from "lucide-react";

interface LessonChatbotProps {
  lessonTitle?: string;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const LessonChatbot: React.FC<LessonChatbotProps> = ({ lessonTitle }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Selection tooltip state
  const [selectionText, setSelectionText] = useState<string>("");
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const hideTooltipTimeout = useRef<number | null>(null);

  const hasSelection = selectionText.trim().length > 0;

  useEffect(() => {
    const handleMouseUp = () => {
      try {
        const sel = window.getSelection();
        const text = sel?.toString() ?? "";
        if (text && text.trim().length > 3) {
          const range = sel!.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectionText(text.trim());
          setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
        } else {
          setSelectionText("");
          setTooltipPos(null);
        }
      } catch {
        // ignore
      }
    };

    const handleScroll = () => {
      // hide tooltip on scroll to avoid misplaced button
      setTooltipPos(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const askWithSelection = () => {
    if (!selectionText) return;
    setOpen(true);
    setInput((prev) => (prev ? prev : "Explain this selection"));
    // Hide tooltip shortly after opening
    if (hideTooltipTimeout.current) window.clearTimeout(hideTooltipTimeout.current);
    hideTooltipTimeout.current = window.setTimeout(() => setTooltipPos(null), 150);
  };

  const send = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const question = input.trim();
    setMessages((m) => [...m, { role: "user", content: question }]);

    try {
      const { data, error } = await supabase.functions.invoke("lesson-chat", {
        body: {
          prompt: question,
          selection: selectionText || undefined,
          lessonTitle: lessonTitle || undefined,
        },
      });

      if (error) throw error;

      const answer = (data as any)?.generatedText ?? "No answer returned.";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e: any) {
      console.error("Chat error:", e);
      toast({
        title: "Chat failed",
        description: e?.message || "There was a problem contacting the AI.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const panel = (
    <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,380px)]">
      {open ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-lg">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="text-sm font-medium">Lesson Assistant</div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto px-3 py-3 space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ask questions about this lesson. Select text to include it automatically.</p>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div className={
                    "inline-block rounded-md px-3 py-2 text-sm " +
                    (m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground")
                  }>
                    {m.content}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t p-2 space-y-2">
            {hasSelection && (
              <div className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                Selection attached ({selectionText.length} chars)
              </div>
            )}
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about timers, PWM, code, etc."
                className="min-h-[44px] max-h-28"
              />
              <Button onClick={send} disabled={loading} className="shrink-0">
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button onClick={() => setOpen(true)} className="rounded-full h-12 w-12 shadow-lg" aria-label="Open chat">
          <MessageCircle className="w-5 h-5" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      {panel}
      {tooltipPos && hasSelection && (
        <div
          className="fixed z-[60]"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: "translate(-50%, -100%)" }}
        >
          <Button size="sm" variant="secondary" onClick={askWithSelection}>
            Ask AI
          </Button>
        </div>
      )}
    </>
  );
};

export default LessonChatbot;
