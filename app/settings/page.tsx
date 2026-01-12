"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Save } from "lucide-react"
import { useState } from "react"

export default function Settings() {
  const [settings, setSettings] = useState({
    apiKey: "••••••••••••••••",
    notifications: true,
    dataRetention: "90",
    theme: "dark",
    emailNotifications: true,
  })

  const handleSave = () => {
    // Handle save logic
    console.log("Settings saved:", settings)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="Settings" />

        <main className="p-8 bg-background min-h-screen max-w-2xl">
          <div className="glass p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold glow-cyan mb-6">Account Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">API Key</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={settings.apiKey}
                    readOnly
                    className="flex-1 bg-card border border-border rounded-lg px-4 py-2 text-sm"
                  />
                  <button className="bg-card hover:bg-card/80 text-foreground font-semibold px-4 py-2 rounded-lg transition-colors">
                    Regenerate
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Data Retention (days)</label>
                <input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-3">Theme</label>
                <div className="flex gap-2">
                  {["light", "dark", "auto"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSettings({ ...settings, theme })}
                      className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                        settings.theme === theme
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-card/80 text-foreground"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="notifications" className="text-sm text-foreground cursor-pointer">
                  Enable notifications
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="email"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="email" className="text-sm text-foreground cursor-pointer">
                  Email notifications
                </label>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 rounded-lg transition-colors mt-8 flex items-center justify-center gap-2 glow-cyan"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>

          <div className="glass p-8 rounded-lg">
            <h2 className="text-xl font-bold glow-purple mb-4">Danger Zone</h2>
            <p className="text-muted-foreground text-sm mb-4">
              These actions cannot be undone. Please proceed with caution.
            </p>
            <button className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive font-semibold py-3 rounded-lg transition-colors">
              Delete All Data
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
