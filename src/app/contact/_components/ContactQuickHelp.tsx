import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function ContactQuickHelp() {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Need Quick Help?</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Live Chat</p>
            <p className="text-sm text-muted-foreground">
              Available Monday-Friday 9 AM - 5 PM
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          Start Live Chat
        </Button>
      </div>
    </div>
  );
}
