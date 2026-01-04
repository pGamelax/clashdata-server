FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Ajuste para a porta que você definiu no Elysia (ex: 3000)
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]