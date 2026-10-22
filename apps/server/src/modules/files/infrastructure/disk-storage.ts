import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, open, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { AppError } from '../../../platform/error.js';
import type { FileStorage } from '../application/ports.js';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function diskStorage(directory: string): FileStorage {
  const path = (id: string) => {
    if (!uuid.test(id)) throw new Error('Invalid storage key');
    return join(directory, `${id}.pdf`);
  };

  return {
    async write(id, input, maxBytes) {
      await mkdir(directory, { recursive: true });
      let size = 0;
      const limit = new Transform({
        transform(chunk: Buffer, _encoding, done) {
          size += chunk.length;
          done(size > maxBytes ? new AppError('LIMIT_EXCEEDED', 'Dosya boyutu sınırı aşıldı.', 413) : null, chunk);
        }
      });
      try {
        await pipeline(input, limit, createWriteStream(path(id), { flags: 'wx', mode: 0o600 }));
        if (!size) throw new AppError('INVALID_DOCUMENT', 'Boş dosya yüklenemez.', 422);
        return size;
      } catch (error) {
        await rm(path(id), { force: true });
        throw error;
      }
    },

    async remove(id) {
      await rm(path(id), { force: true });
    },

    open: (id) => createReadStream(path(id)),

    async signature(id, kind = 'pdf') {
      const handle = await open(path(id), 'r');
      try {
        const bytes = Buffer.alloc(8);
        const { bytesRead } = await handle.read(bytes, 0, 8, 0);
        const signatures = {
          pdf: () => bytes.subarray(0, 5).toString('ascii') === '%PDF-',
          png: () => bytes.toString('hex') === '89504e470d0a1a0a',
          jpg: () => bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
          docx: () => bytes.subarray(0, 4).toString('hex') === '504b0304',
          xlsx: () => bytes.subarray(0, 4).toString('hex') === '504b0304',
          pptx: () => bytes.subarray(0, 4).toString('hex') === '504b0304',
          zip: () => bytes.subarray(0, 4).toString('hex') === '504b0304',
          txt: () => bytesRead > 0 && !bytes.subarray(0, bytesRead).includes(0),
        };
        return signatures[kind]();
      } finally {
        await handle.close();
      }
    },

    async scanPayload(id, kind = 'pdf') {
      const handle = await open(path(id), 'r');
      try {
        const stats = await handle.stat();
        const fileSize = stats.size;
        const buffer = Buffer.alloc(Math.min(fileSize, 65536));
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
        const head = buffer.subarray(0, bytesRead);

        // 1. Check for embedded Windows/DOS Executable headers (MZ header with PE / DOS stub)
        if (head.includes(Buffer.from('This program cannot be run in DOS mode')) ||
            (head[0] === 0x4d && head[1] === 0x5a && head.includes(Buffer.from('PE\0\0')))) {
          return { clean: false, threat: 'EMBEDDED_EXECUTABLE' };
        }

        // 2. Check for Shell Script Shebangs in non-text files
        if (kind !== 'txt') {
          const shebangs = [Buffer.from('#!/bin/sh'), Buffer.from('#!/bin/bash'), Buffer.from('#!/usr/bin/')];
          for (const sb of shebangs) {
            if (head.includes(sb)) return { clean: false, threat: 'SHELL_SCRIPT' };
          }
        }

        // 3. For PDF files: scan for malicious actions and exploit objects
        if (kind === 'pdf') {
          const headStr = head.toString('binary');
          if (/\/Launch\s*[</(]/.test(headStr) || /\/Launch\b/.test(headStr)) {
            return { clean: false, threat: 'PDF_LAUNCH_ACTION' };
          }

          if (headStr.includes('/EmbeddedFiles') && headStr.includes('.exe')) {
            return { clean: false, threat: 'PDF_EMBEDDED_EXE' };
          }

          if (fileSize > 65536) {
            const tailOffset = Math.max(0, fileSize - 65536);
            const tailBuffer = Buffer.alloc(Math.min(65536, fileSize - tailOffset));
            const { bytesRead: tailRead } = await handle.read(tailBuffer, 0, tailBuffer.length, tailOffset);
            const tailStr = tailBuffer.subarray(0, tailRead).toString('binary');
            if (/\/Launch\s*[</(]/.test(tailStr) || /\/Launch\b/.test(tailStr)) {
              return { clean: false, threat: 'PDF_LAUNCH_ACTION' };
            }
          }
        }

        // 4. For DOCX / XLSX: check for disguised VBA macro binaries in standard non-macro documents
        if (kind === 'docx' || kind === 'xlsx') {
          const headHex = head.toString('binary');
          if (headHex.includes('vbaProject.bin') || headHex.includes('word/vbaProject.bin') || headHex.includes('xl/vbaProject.bin')) {
            return { clean: false, threat: 'VBA_MACRO_PAYLOAD' };
          }
          if (fileSize > 65536) {
            const tailOffset = Math.max(0, fileSize - 65536);
            const tailBuffer = Buffer.alloc(Math.min(65536, fileSize - tailOffset));
            const { bytesRead: tailRead } = await handle.read(tailBuffer, 0, tailBuffer.length, tailOffset);
            const tailStr = tailBuffer.subarray(0, tailRead).toString('binary');
            if (tailStr.includes('vbaProject.bin') || tailStr.includes('word/vbaProject.bin') || tailStr.includes('xl/vbaProject.bin')) {
              return { clean: false, threat: 'VBA_MACRO_PAYLOAD' };
            }
          }
        }

        return { clean: true };
      } finally {
        await handle.close();
      }
    },
  };
}
