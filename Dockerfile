# Use a lightweight Nginx web server image
FROM nginx:alpine

# Copy all your website files from your local folder into Nginx's public directory
COPY . /usr/share/nginx/html

# Expose port 80 to allow web traffic into the container
EXPOSE 80
