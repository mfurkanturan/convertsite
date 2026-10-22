import { engineHttpApp } from '../engine/http-app.js';
const token = process.env.ENGINE_TOKEN;
if (!token || token.length < 32) throw new Error('ENGINE_TOKEN required');
await engineHttpApp(token).listen({ host: '127.0.0.1', port: 3002 });
