'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('settings') as any; // Using any since next-intl might not be typed
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, call the change password API
    alert('Password change functionality to be implemented');
  };

  const handleLanguageChange = (value: string) => {
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your dashboard preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Language</label>
              <select 
                id="language"
                defaultValue="en" 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              >
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="current-password" className="text-sm font-medium leading-none">Current Password</label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium leading-none">New Password</label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={password.new}
                  onChange={(e) => setPassword({ ...password, new: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium leading-none">Confirm New Password</label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
