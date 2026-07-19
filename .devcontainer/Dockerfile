FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install explicit Python 3.12 packages, Node.js 24, Corepack (pnpm), and Just
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3.12 \
        python3.12-venv \
        python3.12-dev \
        python3-pip \
    && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && corepack enable \
    && curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Switch to non-root vscode user to install uv and prime caches
USER vscode
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/home/vscode/.local/bin:${PATH}" \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1

# Prime the UV wheel cache
WORKDIR /tmp/cache-warmup/server
COPY --chown=vscode:vscode server/pyproject.toml server/uv.lock ./
RUN uv sync --no-install-project

# Prime the PNPM content-addressable store
WORKDIR /tmp/cache-warmup/client
COPY --chown=vscode:vscode client/package.json client/pnpm-lock.yaml client/pnpm-workspace.yaml ./
RUN pnpm fetch

# Clean up temporary warmup directory and reset to default workspace
WORKDIR /workspaces/FileDrive
RUN rm -rf /tmp/cache-warmup
