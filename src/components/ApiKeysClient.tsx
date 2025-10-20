'use client';

import { useState } from 'react';
import { ShieldCheck, Clipboard, Check, RefreshCcw, Loader2 } from 'lucide-react';

type ApiKeysClientProps = {
  initialPublicKey: string;
  initialSecretKey: string;
};

export default function ApiKeysClient({
  initialPublicKey,
  initialSecretKey,
}: ApiKeysClientProps) {
  const [publicKey, setPublicKey] = useState(initialPublicKey);
  const [secretKey, setSecretKey] = useState(initialSecretKey);
  const [copiedKey, setCopiedKey] = useState<'public' | 'secret' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Copy to clipboard handler
  const handleCopy = (key: string, type: 'public' | 'secret') => {
    navigator.clipboard.writeText(key);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000); // Reset after 2s
  };

  // Regenerate keys handler
  const handleRegenerate = async () => {
    // Show confirmation dialog
    if (
      !window.confirm(
        'Are you sure you want to regenerate your API keys? Your old keys will stop working immediately.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/regenerate-keys', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        setPublicKey(data.publicKey);
        setSecretKey(data.secretKey);
      } else {
        alert('Failed to regenerate keys: ' + data.message);
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
      console.error('Regenerate Keys Error:', err);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* API Keys Card */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-text-light-primary">
          API Keys
        </h2>
        <p className="mb-6 text-sm text-text-light-secondary">
          Your secret keys should be kept confidential and only stored on your
          own servers.
        </p>

        {/* Public Key */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-light-secondary">
            Public Key
          </label>
          <div className="flex items-center gap-2">
            <pre className="flex-1 p-3 overflow-x-auto text-sm rounded-lg bg-light-background text-text-light-primary border border-gray-200">
              {publicKey}
            </pre>
            <button
              onClick={() => handleCopy(publicKey, 'public')}
              className="p-2 transition-colors rounded-lg text-text-light-secondary hover:bg-gray-100"
            >
              {copiedKey === 'public' ? (
                <Check className="w-5 h-5 text-accent" />
              ) : (
                <Clipboard className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Secret Key */}
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-text-light-secondary">
            Secret Key
          </label>
          <div className="flex items-center gap-2">
            <pre className="flex-1 p-3 overflow-x-auto text-sm rounded-lg bg-light-background text-text-light-primary border border-gray-200">
              {secretKey}
            </pre>
            <button
              onClick={() => handleCopy(secretKey, 'secret')}
              className="p-2 transition-colors rounded-lg text-text-light-secondary hover:bg-gray-100"
            >
              {copiedKey === 'secret' ? (
                <Check className="w-5 h-5 text-accent" />
              ) : (
                <Clipboard className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security & Regeneration Card */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="flex">
          <ShieldCheck className="w-12 h-12 mr-4 text-accent" />
          <div>
            <h3 className="text-lg font-semibold text-text-light-primary">
              Security and Regeneration
            </h3>
            <p className="mt-1 mb-4 text-sm text-text-light-secondary">
              If your keys are compromised, regenerate them immediately. This
              action is irreversible.
            </p>
            <button
              onClick={handleRegenerate}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Regenerating...' : 'Regenerate Secret Key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}