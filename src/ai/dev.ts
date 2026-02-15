import { config } from 'dotenv';
config();

import '@/ai/flows/generate-bot-specification-from-prompt.ts';
import '@/ai/flows/validate-bot-specification-compliance-flow.ts';