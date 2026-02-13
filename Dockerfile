# Build stage
FROM node:24.11.1-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source and build
COPY . .

# API base URL must be set at build time (Vite bakes it into the bundle).
# Pass with: docker build --build-arg VITE_API_BASE_URL=https://your-api.com
ARG VITE_API_BASE_URL=http://electionbooth.ap-south-1.elasticbeanstalk.com/api/election
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
