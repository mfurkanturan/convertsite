import { createContext } from '../bootstrap/context.js';
import { createHttpApp } from '../bootstrap/http-app.js';
const context = await createContext();
const app = await createHttpApp(context);
await app.listen({ host: process.env.API_HOST === '0.0.0.0' ? '0.0.0.0' : '127.0.0.1', port: context.config.port });
async function shutdown() { await app.close(); await context.close(); }
process.once('SIGINT', () => { void shutdown(); });
process.once('SIGTERM', () => { void shutdown(); });
