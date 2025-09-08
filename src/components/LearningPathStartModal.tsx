import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, X } from "lucide-react";

interface LearningPathStartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSmartStart: () => void;
  onStartFromBeginning: () => void;
  pathTitle: string;
}

export default function LearningPathStartModal({
  open,
  onOpenChange,
  onSmartStart,
  onStartFromBeginning,
  pathTitle
}: LearningPathStartModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">How would you like to begin your journey?</DialogTitle>
          <DialogDescription className="text-base">
            We can help you find the best starting point, or you can begin from the very first lesson.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <Button
            onClick={onSmartStart}
            className="w-full h-auto p-6 flex flex-col items-start gap-3 bg-primary hover:bg-primary/90"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Smart Start (with placement test)</span>
            </div>
            <p className="text-sm text-primary-foreground/80 text-left">
              Answer a few quick questions so we can place you at the right level.
            </p>
          </Button>

          <Button
            onClick={onStartFromBeginning}
            variant="secondary"
            className="w-full h-auto p-6 flex flex-col items-start gap-3"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Start from Lesson 1</span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Go through the entire course step by step, from the very beginning.
            </p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}