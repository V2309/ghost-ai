import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        You don't have permission to access this project, or it doesn't exist.
      </p>
      <Link href="/editor">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
}
