import { Moon, Bell, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-surface border border-border rounded-xl divide-y divide-border">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="h-5 w-5 text-accent" />
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-secondary">Always enabled for premium experience</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-accent rounded-full p-1 flex items-center justify-end">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-accent" />
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-secondary">Get notified when processing completes</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-border rounded-full p-1 flex items-center">
            <div className="w-4 h-4 bg-secondary rounded-full" />
          </div>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-accent" />
            <div>
              <h3 className="font-medium">Language</h3>
              <p className="text-sm text-secondary">Interface language</p>
            </div>
          </div>
          <select className="bg-elevated border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="font-medium mb-2">About Study Companion </h3>
        <p className="text-sm text-secondary">
          An AI-powered learning platform designed to help you study faster and more efficiently. No accounts needed, just instant learning.
        </p>
      </div>
    </div>
  );
}