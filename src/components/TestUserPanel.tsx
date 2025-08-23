import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testUsers, createTestUsers, signInAsTestUser } from "@/utils/createTestUsers";
import { toast } from "sonner";
import { Users, UserPlus, LogIn } from "lucide-react";

export const TestUserPanel = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null);

  const handleCreateTestUsers = async () => {
    setIsCreating(true);
    toast.info("Creating test users...");
    
    try {
      const results = await createTestUsers();
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`Created ${successCount} test users successfully!`);
      }
      if (failureCount > 0) {
        toast.warning(`${failureCount} users already exist or failed to create`);
      }
    } catch (error) {
      toast.error("Failed to create test users");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickSignIn = async (email: string, password: string) => {
    setIsSigningIn(email);
    
    try {
      const result = await signInAsTestUser(email, password);
      if (result.success) {
        toast.success(`Signed in as ${email}`);
        // The auth state change will handle the redirect
      } else {
        toast.error(result.error || "Failed to sign in");
      }
    } catch (error) {
      toast.error("Failed to sign in");
      console.error(error);
    } finally {
      setIsSigningIn(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Test Users Panel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create and sign in with test users for development
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleCreateTestUsers}
          disabled={isCreating}
          className="w-full gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {isCreating ? "Creating..." : "Create All Test Users"}
        </Button>
        
        <div className="space-y-3">
          <h3 className="font-semibold">Quick Sign In:</h3>
          {testUsers.map((user) => (
            <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  Password: {user.password}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickSignIn(user.email, user.password)}
                disabled={isSigningIn === user.email}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                {isSigningIn === user.email ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <ol className="text-sm space-y-1 text-muted-foreground">
            <li>1. Click "Create All Test Users" to add them to your Supabase database</li>
            <li>2. Use "Sign In" buttons for quick testing</li>
            <li>3. Or manually enter the credentials in the login form</li>
            <li>4. Check your Supabase dashboard to see the created users</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};