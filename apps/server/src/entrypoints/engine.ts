import { engineHttpApp } from '../engine/http-app.js';
const token = process.env.ENGINE_TOKEN;
if (!token || token.length < 32) throw new Error('ENGINE_TOKEN required');
await engineHttpApp(token).listen({ host: '0.0.0.0', port: 3002 });
