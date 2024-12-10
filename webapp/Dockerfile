# Stage 1: Build the React application
FROM node:18 as build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean and setup npm
RUN npm cache clean --force && \
    npm set legacy-peer-deps=true

# Install dependencies in a specific order
RUN npm install && \
    npm install @jridgewell/gen-mapping@0.3.2 && \
    npm install @babel/generator@7.23.0 && \
    npm install @babel/traverse@7.23.0

# Copy the rest of the application
COPY . .

# Build with increased memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm rebuild && npm run build

# Stage 2: Serve the app with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
COPY public/env.template.js /usr/share/nginx/html/env.template.js
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
