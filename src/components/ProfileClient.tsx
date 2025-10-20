'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type ProfileClientProps = {
  merchant: {
    name: string;
    email: string;
  };
};

export default function ProfileClient({ merchant }: ProfileClientProps) {
  // State for updating name
  const [name, setName] = useState(merchant.name);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMessage, setNameMessage] = useState({ type: '', text: '' });

  // State for updating password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  // Handle Name Update
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameLoading(true);
    setNameMessage({ type: '', text: '' });

    const res = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (data.success) {
      setNameMessage({ type: 'success', text: data.message });
    } else {
      setNameMessage({ type: 'error', text: data.message });
    }
    setNameLoading(false);
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMessage({ type: '', text: '' });

    const res = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (data.success) {
      setPassMessage({ type: 'success', text: data.message });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPassMessage({ type: 'error', text: data.message });
    }
    setPassLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Update Business Name Card */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-text-light-primary">
          Profile Settings
        </h2>
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-text-light-secondary">
              Email Address (cannot be changed)
            </label>
            <input
              type="email"
              value={merchant.email}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-text-light-secondary"
            >
              Business Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Messages */}
          {nameMessage.text && (
            <p
              className={`text-sm ${
                nameMessage.type === 'success'
                  ? 'text-status-success'
                  : 'text-status-error'
              }`}
            >
              {nameMessage.text}
            </p>
          )}

          <button
            type="submit"
            disabled={nameLoading}
            className="flex items-center justify-center px-5 py-3 font-medium text-primary-dark bg-accent rounded-lg shadow-md transition-all duration-300 hover:bg-emerald-400 active:scale-95 disabled:bg-gray-400"
          >
            {nameLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>

      {/* 2. Update Password Card */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-text-light-primary">
          Change Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block mb-1 text-sm font-medium text-text-light-secondary"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block mb-1 text-sm font-medium text-text-light-secondary"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Messages */}
          {passMessage.text && (
            <p
              className={`text-sm ${
                passMessage.type === 'success'
                  ? 'text-status-success'
                  : 'text-status-error'
              }`}
            >
              {passMessage.text}
            </p>
          )}

          <button
            type="submit"
            disabled={passLoading}
            className="flex items-center justify-center px-5 py-3 font-medium text-white bg-secondary rounded-lg shadow-md transition-all duration-300 hover:bg-primary-dark active:scale-95 disabled:bg-gray-400"
          >
            {passLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}