# Use a multi-stage build to reduce the final image size
FROM node:alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock first to leverage Docker layer caching
COPY *.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Use a smaller base image for the final stage
FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env ./
COPY --from=builder /usr/src/app/package.json ./package.json

# Create a non-root user and group
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# # Set ownership of the working directory
# RUN chown -R appuser:appgroup /usr/src/app

# # Switch to the non-root user
# USER appuser

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
	CMD curl --retry 3 --fail http://localhost:3000/api/v0/health || exit 1

# Expose the application port
EXPOSE 3000

# Set the command to run the application
CMD ["node", "dist/src/main"]