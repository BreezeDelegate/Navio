const SERVER_KEY_NAMES = [
  'GEMINI_API_KEY',
  'GOOGLE_API_KEY',
  'GOOGLE_GENAI_API_KEY',
] as const;

function normalizeApiKey(value: string | undefined | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function getServerGeminiApiKey(): string | null {
  for (const name of SERVER_KEY_NAMES) {
    const key = normalizeApiKey(process.env[name]);
    if (key) {
      return key;
    }
  }

  return null;
}

export function hasServerGeminiApiKey(): boolean {
  return getServerGeminiApiKey() !== null;
}

export function resolveGeminiApiKey(userApiKey?: string | null): string | null {
  return normalizeApiKey(userApiKey) ?? getServerGeminiApiKey();
}

export function redactSecret(message: string, secret: string): string {
  return secret ? message.split(secret).join('[redacted]') : message;
}
