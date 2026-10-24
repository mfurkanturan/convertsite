FROM node:24-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends qpdf util-linux poppler-utils python3 python3-venv libreoffice-writer libreoffice-calc libreoffice-impress tesseract-ocr tesseract-ocr-eng tesseract-ocr-tur fonts-dejavu-core fonts-liberation2 && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y --no-install-recommends fonts-crosextra-carlito fonts-crosextra-caladea && rm -rf /var/lib/apt/lists/*
COPY apps/server/engine/requirements.txt /tmp/requirements.txt
RUN python3 -m venv /opt/docly-python && /opt/docly-python/bin/pip install --no-cache-dir -r /tmp/requirements.txt
ENV OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 MKL_NUM_THREADS=1
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN corepack enable && pnpm install --frozen-lockfile --filter @convertsite/server...
COPY apps/server apps/server
COPY packages/contracts packages/contracts
COPY infra/start-production.sh /app/start.sh
RUN chmod +x /app/start.sh
USER node
WORKDIR /app/apps/server
EXPOSE 3001
CMD ["/app/start.sh"]
