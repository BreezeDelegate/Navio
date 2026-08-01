import { access, readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const envPath = '.env.local';

async function hasConfiguredKey() {
  try {
    await access(envPath);
    const content = await readFile(envPath, 'utf8');
    return /^(GEMINI_API_KEY|GOOGLE_API_KEY)=\S+/m.test(content);
  } catch {
    return false;
  }
}

if (await hasConfiguredKey()) {
  console.log('Navio is already configured. Run npm run dev.');
  process.exit(0);
}

const prompt = createInterface({ input, output });
const key = (await prompt.question('Paste your Gemini API key: ')).trim();
prompt.close();

if (!key) {
  console.error('No key was saved. Run npm run setup again when ready.');
  process.exit(1);
}

await writeFile(envPath, `GEMINI_API_KEY=${key}\n`, { mode: 0o600 });
console.log('Configuration saved. Run npm run dev, then open http://localhost:3000.');
