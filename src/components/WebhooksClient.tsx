'use client';

import { useState } from 'react';
import { IWebhook } from '@/models/Webhook';
import { Plus, Webhook as WebhookIcon, Globe, Loader2 } from 'lucide-react';

type WebhooksClientProps = {
  initialWebhooks: IWebhook[];
};

export default function WebhooksClient({
  initialWebhooks,
}: WebhooksClientProps) {
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [newUrl, setNewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // For this demo, we'll subscribe to both events by default
      const events = ['payment.success', 'payment.failed'];
      const res = await fetch('/api/merchant/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We use the merchant's session cookie, not API key,
        // because this is an action from the dashboard
        body: JSON.stringify({ url: newUrl, events }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to create webhook');
      }

      setWebhooks([data.data, ...webhooks]); // Add new webhook to top of list
      setNewUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Add Webhook Form */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-text-light-primary">
          Add a new Webhook Endpoint
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <input
              type="url"
              placeholder="https://your-server.com/api/webhook"
              className="w-full px-4 py-3 pl-10 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
            />
            <Globe className="absolute w-5 h-5 top-3.5 left-3 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center px-5 py-3 font-medium text-primary-dark bg-accent rounded-lg shadow-md transition-all duration-300 hover:bg-emerald-400 active:scale-95 disabled:bg-gray-400"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            Add Endpoint
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-status-error">{error}</p>}
      </div>

      {/* 2. List of Webhooks */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h3 className="mb-4 text-xl font-semibold text-text-light-primary">
          Your Endpoints
        </h3>
        <div className="space-y-4">
          {webhooks.length > 0 ? (
            webhooks.map((hook) => (
              <div
                key={String(hook._id)}
                className="flex flex-col p-4 border border-gray-200 rounded-lg md:flex-row md:items-center"
              >
                <WebhookIcon className="w-6 h-6 mr-3 text-accent" />
                <div className="flex-1">
                  <p className="font-mono text-sm font-medium text-text-light-primary">
                    {hook.url}
                  </p>
                  <p className="text-xs text-text-light-secondary">
                    Subscribed to: {hook.events.join(', ')}
                  </p>
                </div>
                <p className="mt-2 text-xs text-gray-400 md:mt-0 md:ml-4">
                  Created: {new Date(hook.createdAt).toLocaleDateString()}
                </p>
                {/* TODO: Add a 'Delete' button here */}
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-text-light-secondary">
              You haven&apos;t added any webhook endpoints yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}