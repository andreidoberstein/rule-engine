FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# copiar schema do prisma primeiro (melhora cache)
COPY prisma ./prisma

# gerar prisma client
RUN pnpm prisma generate

# agora copiar restante
COPY . .

# build
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]