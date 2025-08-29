import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Users, Lock } from "lucide-react";
import { FlashcardDeck } from "@/types/flashcard";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  deck: FlashcardDeck;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ deck, isOpen, onClose }: ShareModalProps) {
  const [isPublic, setIsPublic] = useState(deck.isPublic);
  const [allowCollaboration, setAllowCollaboration] = useState(deck.allowCollaboration);
  const [shareCode, setShareCode] = useState(deck.shareCode || "");
  const { toast } = useToast();

  const shareUrl = `https://genesis-learn.com/decks/${deck.id}${shareCode ? `?code=${shareCode}` : ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard",
    });
  };

  const handleGenerateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setShareCode(newCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share "{deck.name}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Visibility Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="public-switch">Public Deck</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone can find and access this deck
                </p>
              </div>
              <Switch
                id="public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="collab-switch">Allow Collaboration</Label>
                <p className="text-sm text-muted-foreground">
                  Others can edit and add cards
                </p>
              </div>
              <Switch
                id="collab-switch"
                checked={allowCollaboration}
                onCheckedChange={setAllowCollaboration}
              />
            </div>
          </div>

          {/* Share Code */}
          <div className="space-y-3">
            <Label>Invite Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom code"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleGenerateCode}>
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Private decks require this code to access
            </p>
          </div>

          {/* Share URL */}
          <div className="space-y-3">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Permissions Preview */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-medium">Permissions</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={isPublic ? "default" : "secondary"} className="text-xs">
                {isPublic ? (
                  <>
                    <Users className="w-3 h-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
              <Badge variant={allowCollaboration ? "default" : "secondary"} className="text-xs">
                {allowCollaboration ? "Can Edit" : "View Only"}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}