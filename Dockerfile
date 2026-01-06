# Official Playwright image (includes browsers + deps)
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./

RUN npm ci

# Copy the rest
COPY . .

# Force CI + run Chromium tests
ENV CI=true

CMD ["npx", "playwright", "test", "--project=chromium"]
