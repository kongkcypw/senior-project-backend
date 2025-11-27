# 1. Build Stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy ALL necessary config files *before* the build
COPY tsconfig*.json nest-cli.json .env.example ./

# Copy all source files
COPY . .

# Run the build command
# The output (dist directory) will be generated here
RUN npm run build


# 2. Production Stage
FROM node:22-alpine AS production

# Set the working directory for the app in the final image
WORKDIR /usr/src/app

# Only copy the essential files from the build stage:
# 1. package*.json to re-run 'npm install --omit=dev'
# 2. node_modules (production only)
# 3. The built application code (dist)
COPY package*.json ./

# Install only production dependencies
# The `dist` folder should be copied before this if you need it for some post-install step,
# but usually, you install dependencies first.
RUN npm install --only=production

# COPY tsconfig.json into the final image for tsconfig-paths/register
COPY --from=builder /usr/src/app/tsconfig.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Set port environment variables
ENV PORT=9000

# Expose the port the app runs on
EXPOSE 9000

# The command to run the application
# This is where the error occurs, ensure the path is correct: dist/main
CMD [ "node", "-r", "tsconfig-paths/register", "dist/main" ]