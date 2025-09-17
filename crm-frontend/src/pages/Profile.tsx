import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync form data if user object changes (e.g., after login)
  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || '',
            email: user.email || ''
        });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
        toast({ title: "Missing Information", description: "Name and email cannot be empty.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    try {
      const success = await updateUser(formData);
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Profile</h1>
            <p className="text-muted-foreground text-lg">Manage your account settings</p>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Member since</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full bg-gradient-primary hover:shadow-primary" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;