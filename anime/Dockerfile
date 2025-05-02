# Use official Nginx image
FROM nginx:alpine

# Remove default Nginx config (optional, if you're using your own)
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend files (e.g., index.html, style.css, script.js)
COPY ./ /usr/share/nginx/html

# Expose port
EXPOSE 80
