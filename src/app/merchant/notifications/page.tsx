"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Loader2, Save } from "lucide-react";

interface NotificationSettings {
  emailNotifications: {
    paymentSuccess: boolean;
    paymentFailed: boolean;
    refunds: boolean;
    disputes: boolean;
    disputeResolved: boolean;
  };
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      paymentSuccess: true,
      paymentFailed: true,
      refunds: true,
      disputes: true,
      disputeResolved: true,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // In a real app, fetch settings from API
    setIsLoading(false);
  }, []);

  const handleToggle = (
    key: keyof NotificationSettings["emailNotifications"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessage("Notification settings saved successfully!");
    setIsSaving(false);

    setTimeout(() => setMessage(""), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Bell className="w-8 h-8 text-accent" />
        <h1 className="text-2xl font-bold text-text-light-primary">
          Notification Settings
        </h1>
      </div>

      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-text-light-primary">
            Email Notifications
          </h2>
        </div>

        <div className="space-y-4">
          {/* Payment Success */}
          <div className="flex items-center justify-between p-4 bg-light-background rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium text-text-light-primary">
                Payment Success
              </h3>
              <p className="text-sm text-text-light-secondary">
                Receive emails when payments are successfully processed
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.paymentSuccess}
                onChange={() => handleToggle("paymentSuccess")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Payment Failed */}
          <div className="flex items-center justify-between p-4 bg-light-background rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium text-text-light-primary">
                Payment Failed
              </h3>
              <p className="text-sm text-text-light-secondary">
                Receive emails when payment attempts fail
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.paymentFailed}
                onChange={() => handleToggle("paymentFailed")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Refunds */}
          <div className="flex items-center justify-between p-4 bg-light-background rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium text-text-light-primary">Refunds</h3>
              <p className="text-sm text-text-light-secondary">
                Receive emails when refunds are processed
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.refunds}
                onChange={() => handleToggle("refunds")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Disputes Created */}
          <div className="flex items-center justify-between p-4 bg-light-background rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium text-text-light-primary">
                Disputes Created
              </h3>
              <p className="text-sm text-text-light-secondary">
                Receive emails when customers file disputes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.disputes}
                onChange={() => handleToggle("disputes")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Disputes Resolved */}
          <div className="flex items-center justify-between p-4 bg-light-background rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium text-text-light-primary">
                Disputes Resolved
              </h3>
              <p className="text-sm text-text-light-secondary">
                Receive emails when disputes are resolved
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.disputeResolved}
                onChange={() => handleToggle("disputeResolved")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-emerald-400 transition-colors disabled:bg-gray-400 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
          {message && (
            <p className="text-sm font-medium text-accent">{message}</p>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">
          ℹ️ About Email Notifications
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Emails are sent to your registered merchant email address</li>
          <li>
            • Customer notifications are sent automatically for their
            transactions
          </li>
          <li>• You can disable specific notification types anytime</li>
          <li>
            • Important security alerts will always be sent regardless of
            settings
          </li>
        </ul>
      </div>
    </div>
  );
}
