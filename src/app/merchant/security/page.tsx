"use client";

import { useState, useEffect } from "react";
import { Shield, Key, FileText, Loader2 } from "lucide-react";

interface AuditLog {
  _id: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSetup, setShowSetup] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/merchant/audit-logs");
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    }
  };

  const handleSetup2FA = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setQrCode(data.data.qrCode);
        setSecret(data.data.secret);
        setShowSetup(true);
      } else {
        setMessage(data.message || "Failed to setup 2FA");
      }
    } catch {
      setMessage("Error setting up 2FA");
    }
    setIsLoading(false);
  };

  const handleEnable2FA = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(true);
        setShowSetup(false);
        setMessage("2FA enabled successfully!");
        fetchAuditLogs();
      } else {
        setMessage(data.message || "Failed to enable 2FA");
      }
    } catch {
      setMessage("Error enabling 2FA");
    }
    setIsLoading(false);
  };

  const handleDisable2FA = async () => {
    if (!confirm("Are you sure you want to disable 2FA?")) return;
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(false);
        setMessage("2FA disabled successfully");
        fetchAuditLogs();
      } else {
        setMessage(data.message || "Failed to disable 2FA");
      }
    } catch {
      setMessage("Error disabling 2FA");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-text-light-primary">
        Security Settings
      </h1>

      {/* Two-Factor Authentication */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-text-light-primary">
            Two-Factor Authentication
          </h2>
        </div>
        <p className="text-sm text-text-light-secondary mb-4">
          Add an extra layer of security to your account by enabling 2FA.
        </p>

        {!twoFactorEnabled && !showSetup && (
          <button
            onClick={handleSetup2FA}
            disabled={isLoading}
            className="px-6 py-2 font-medium text-white bg-accent rounded-lg shadow-md hover:bg-emerald-400 disabled:bg-gray-400"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Setup 2FA"
            )}
          </button>
        )}

        {showSetup && !twoFactorEnabled && (
          <div className="space-y-4">
            <p className="text-sm font-medium">
              1. Scan this QR code with your authenticator app (Google
              Authenticator, Authy, etc.):
            </p>
            {qrCode && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
            )}
            <p className="text-sm font-medium">
              2. Or enter this secret key manually:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{secret}</code>
            </p>
            <p className="text-sm font-medium">
              3. Enter the 6-digit code from your authenticator app:
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
              maxLength={6}
            />
            <button
              onClick={handleEnable2FA}
              disabled={isLoading || verificationCode.length !== 6}
              className="px-6 py-2 font-medium text-white bg-accent rounded-lg shadow-md hover:bg-emerald-400 disabled:bg-gray-400"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify and Enable"
              )}
            </button>
          </div>
        )}

        {twoFactorEnabled && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-status-success">
              <Shield className="w-5 h-5" />
              <span className="font-medium">2FA is enabled</span>
            </div>
            <p className="text-sm text-text-light-secondary">
              Enter your 6-digit code to disable 2FA:
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
              maxLength={6}
            />
            <button
              onClick={handleDisable2FA}
              disabled={isLoading || verificationCode.length !== 6}
              className="px-6 py-2 font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Disable 2FA"
              )}
            </button>
          </div>
        )}

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("success")
                ? "text-status-success"
                : "text-status-error"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* API Key Rotation */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-text-light-primary">
            API Key Management
          </h2>
        </div>
        <p className="text-sm text-text-light-secondary mb-4">
          Rotate your API keys regularly for enhanced security. Visit the{" "}
          <a href="/merchant/apikeys" className="text-accent underline">
            API Keys page
          </a>{" "}
          to regenerate your keys.
        </p>
      </div>

      {/* Audit Logs */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-text-light-primary">
            Audit Logs
          </h2>
        </div>
        <p className="text-sm text-text-light-secondary mb-4">
          Recent security-related activities on your account:
        </p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div
                key={log._id}
                className="p-3 bg-light-background rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-text-light-primary">
                      {log.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-text-light-secondary">
                      {log.details}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      IP: {log.ipAddress}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-text-light-secondary py-4">
              No audit logs yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
