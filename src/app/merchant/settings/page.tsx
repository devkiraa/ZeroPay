"use client";

import { useState } from "react";

const initialSettings = {
  businessName: "",
  businessEmail: "",
  logoUrl: "",
  notifyPayments: true,
  notifyRefunds: true,
};

export default function MerchantSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-text-light-primary">
        Merchant Settings
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
