"use client";

import { useState, useEffect } from "react";
import { TestTube2, Zap } from "lucide-react";

const initialSettings = {
  businessName: "",
  businessEmail: "",
  logoUrl: "",
  notifyPayments: true,
  notifyRefunds: true,
  sandboxMode: true,
};

export default function MerchantSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingMode, setIsTogglingMode] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch merchant settings
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      if (data.success && data.merchant) {
        setSettings((prev) => ({
          ...prev,
          businessName: data.merchant.name || "",
          businessEmail: data.merchant.email || "",
          sandboxMode: data.merchant.sandboxMode ?? true,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSandboxMode = async () => {
    setIsTogglingMode(true);
    setMessage("");
    try {
      const res = await fetch("/api/merchant/toggle-sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sandboxMode: !settings.sandboxMode }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev) => ({ ...prev, sandboxMode: data.sandboxMode }));
        setMessage(data.message);
      } else {
        setMessage(data.message || "Failed to toggle mode");
      }
    } catch (error) {
      setMessage("Failed to toggle sandbox mode");
      console.error(error);
    }
    setIsTogglingMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setMessage("Settings saved!");
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-text-light-primary">
        Merchant Settings
      </h1>

      {/* Sandbox Mode Toggle */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text-light-primary mb-2 flex items-center gap-2">
              {settings.sandboxMode ? (
                <>
                  <TestTube2 className="w-5 h-5 text-blue-600" />
                  Sandbox Mode (Test)
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-accent" />
                  Live Mode
                </>
              )}
            </h2>
            <p className="text-sm text-text-light-secondary mb-4">
              {settings.sandboxMode
                ? "All transactions are simulated and no real money is processed. Use this mode for testing integrations."
                : "Live mode processes real transactions. Ensure your integration is thoroughly tested before enabling."}
            </p>
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                settings.sandboxMode
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {settings.sandboxMode ? "Test Mode Active" : "Live Mode Active"}
            </div>
          </div>
          <button
            onClick={toggleSandboxMode}
            disabled={isTogglingMode}
            className={`ml-4 px-6 py-2 font-medium text-white rounded-lg shadow-md transition-colors ${
              settings.sandboxMode
                ? "bg-accent hover:bg-emerald-400"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:bg-gray-400`}
          >
            {isTogglingMode
              ? "Switching..."
              : settings.sandboxMode
              ? "Go Live"
              : "Go to Sandbox"}
          </button>
        </div>
      </div>

      {/* Business Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-primary-light rounded-2xl shadow-md space-y-6"
      >
        <h2 className="text-lg font-semibold text-text-light-primary">
          Business Information
        </h2>
        <div>
          <label className="block mb-1 font-medium text-text-light-secondary">
            Business Name
          </label>
          <input
            type="text"
            name="businessName"
            value={settings.businessName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-light-secondary">
            Business Email
          </label>
          <input
            type="email"
            name="businessEmail"
            value={settings.businessEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-text-light-secondary">
            Logo URL
          </label>
          <input
            type="url"
            name="logoUrl"
            value={settings.logoUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
            placeholder="https://yourdomain.com/logo.png"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifyPayments"
              checked={settings.notifyPayments}
              onChange={handleChange}
            />
            Notify on payments
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifyRefunds"
              checked={settings.notifyRefunds}
              onChange={handleChange}
            />
            Notify on refunds
          </label>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 font-medium text-white bg-accent rounded-lg shadow-md hover:bg-emerald-400 disabled:bg-gray-400"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
        {message && <p className="mt-2 text-status-success">{message}</p>}
      </form>
    </div>
  );
}
