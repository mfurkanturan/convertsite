import { engineHttpApp } from '../engine/http-app.js';
const token = process.env.ENGINE_TOKEN;
if (!token || token.length < 32) throw new Error('ENGINE_TOKEN required');
// Loopback by default (all-in-one container); the isolated compose engine opts into 0.0.0.0 on its private network.
const host = process.env.ENGINE_HOST === '0.0.0.0' ? '0.0.0.0' : '127.0.0.1';
await engineHttpApp(token).listen({ host, port: 3002 });
