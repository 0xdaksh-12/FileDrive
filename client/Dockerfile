FROM node:24-alpine

WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Enable pnpm through Corepack
RUN corepack enable && pnpm install --frozen-lockfile

# Copy the remaining source code
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]