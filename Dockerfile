# Stage 1: Builder
# This stage installs all dependencies (including dev) and compiles the code.
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# 1. Install Dependencies
# Copy only package files to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# 2. Copy Source and Config
# Copy tsconfig.json and other necessary files (like nest-cli.json)
COPY . .

# 3. Build the Application
# This creates the 'dist' directory
RUN npm run build

# ---
# Stage 2: Production (Final Image)
# This stage is minimal, only containing runtime dependencies and compiled code.
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# 1. Copy only Production Dependencies & Config
COPY package*.json ./

# Ensure tsconfig-paths is in 'dependencies' for this to work
RUN npm install --only=production

# 2. Copy compiled code and necessary config for runtime
# We must copy tsconfig.json so tsconfig-paths/register can resolve paths.
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/tsconfig.json ./
# Copy environment file placeholder if needed
COPY --from=builder /usr/src/app/.env.example ./


# 3. Runtime Configuration
ENV PORT=9000
EXPOSE 9000

# 4. Start Command
# Use the working node binary, register tsconfig-paths, and run the compiled main file.
# The previous errors confirm this command is correct IF dist/main exists.
CMD [ "node", "-r", "tsconfig-paths/register", "dist/main" ]