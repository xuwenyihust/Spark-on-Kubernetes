# Stage 1: Build the React application
FROM node:14 as build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
COPY public/env.template.js /usr/share/nginx/html/env.template.js
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
