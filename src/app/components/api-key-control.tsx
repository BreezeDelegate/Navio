'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SESSION_KEY = 'navio_gemini_api_key_session';
const LOCAL_KEY = 'navio_gemini_api_key_local';

type ApiKeyControlProps = {
  serverKeyAvailable: boolean;
};

export function ApiKeyControl({ serverKeyAvailable }: ApiKeyControlProps) {
  const [apiKey, setApiKey] = useState('');
  const [rememberOnDevice, setRememberOnDevice] = useState(false);
  const [usePersonalKey, setUsePersonalKey] = useState(!serverKeyAvailable);
  const [showKey, setShowKey] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const persistentKey = window.localStorage.getItem(LOCAL_KEY) ?? '';
    const sessionKey = window.sessionStorage.getItem(SESSION_KEY) ?? '';
    const storedKey = persistentKey || sessionKey;

    if (storedKey) {
      setApiKey(storedKey);
      setRememberOnDevice(Boolean(persistentKey));
      setUsePersonalKey(true);
    }

    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    const normalizedKey = apiKey.trim();

    if (!normalizedKey) {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(LOCAL_KEY);
      return;
    }

    if (rememberOnDevice) {
      window.localStorage.setItem(LOCAL_KEY, normalizedKey);
      window.sessionStorage.removeItem(SESSION_KEY);
    } else {
      window.sessionStorage.setItem(SESSION_KEY, normalizedKey);
      window.localStorage.removeItem(LOCAL_KEY);
    }
  }, [apiKey, rememberOnDevice, storageReady]);

  const clearPersonalKey = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(LOCAL_KEY);
    setApiKey('');
    setRememberOnDevice(false);
    setShowKey(false);
    setUsePersonalKey(!serverKeyAvailable);
  };

  const personalKeyRequired = !serverKeyAvailable;
  const personalKeyActive = personalKeyRequired || usePersonalKey;

  return (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium">
            {serverKeyAvailable && !personalKeyActive ? (
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            ) : (
              <KeyRound className="h-4 w-4 text-primary" />
            )}
            Gemini connection
          </div>
          <p className="text-sm text-muted-foreground">
            {serverKeyAvailable && !personalKeyActive
              ? 'A server-side key is configured for this deployment.'
              : 'Use your own Gemini API key for generation. Navio never adds it to briefs, history or exports.'}
          </p>
        </div>

        {serverKeyAvailable && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUsePersonalKey((current) => !current)}
          >
            {personalKeyActive ? 'Use server key' : 'Use personal key'}
          </Button>
        )}
      </div>

      {personalKeyActive && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Gemini API key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                name="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Paste a Google AI Studio key"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                required={personalKeyRequired}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowKey((current) => !current)}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {apiKey && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearPersonalKey}
                  aria-label="Forget personal API key"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={rememberOnDevice}
              onChange={(event) => setRememberOnDevice(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input accent-primary"
            />
            <span>
              <span className="font-medium">Remember on this device</span>
              <span className="mt-0.5 block text-muted-foreground">
                Off by default: the key lasts only for this browser session. Turning this on stores it in local browser storage, which scripts on this site can access. Do not enable it on a shared device.
              </span>
            </span>
          </label>

          <p className="text-xs text-muted-foreground">
            The key is sent to Navio's server only when you generate a brief, then used for that Gemini request. It is not returned in the response.
          </p>
        </div>
      )}
    </div>
  );
}
