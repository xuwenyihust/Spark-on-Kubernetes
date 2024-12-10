# Stage 1: Build the React application
FROM node:18 as build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install @jridgewell/gen-mapping

# Copy the rest of the application
COPY . .

# Build the application with increased memory allocation
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
COPY public/env.template.js /usr/share/nginx/html/env.template.js
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
