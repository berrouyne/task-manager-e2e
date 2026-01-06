# Official Playwright image (includes browsers + deps)
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Set working directory
WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Default command: run Playwright tests
CMD ["npx", "playwright", "test", "--project=chromium"]
