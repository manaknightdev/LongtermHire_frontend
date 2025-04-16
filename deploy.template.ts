// template for deploy.sh file
export const deployTemplate = (project: string) => {
  return `
#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment process..."

# Configuration
DEPLOY_PATH="/var/www/${project}.manaknightdigital.com"
NGINX_CONFIG="/etc/nginx/sites-available/${project}.manaknightdigital.com"

# Build the application
echo "📦 Building application..."
sudo npm install --force
sudo npm run build

# Ensure deploy directory exists
echo "📁 Setting up deployment directory..."
sudo mkdir -p $DEPLOY_PATH

# Copy build files to deployment directory
echo "📋 Copying files to deployment directory..."
sudo cp -r dist/* $DEPLOY_PATH/

# Set proper permissions
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data $DEPLOY_PATH
sudo chmod -R 755 $DEPLOY_PATH

# Create Nginx configuration if it doesn't exist
if [ ! -f "$NGINX_CONFIG" ]; then
    echo "📝 Creating Nginx configuration..."
    sudo tee $NGINX_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name ${project}.manaknightdigital.com;
    root $DEPLOY_PATH;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Add security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

    # Create symlink to enable the site
    sudo ln -s $NGINX_CONFIG /etc/nginx/sites-enabled/
fi

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx to apply changes
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Setup SSL with Certbot if not already configured
if [ ! -f "/etc/letsencrypt/live/${project}.manaknightdigital.com/fullchain.pem" ]; then
    echo "🔒 Setting up SSL with Let's Encrypt..."
    sudo certbot --nginx \
        --non-interactive \
        --agree-tos \
        --redirect \
        --staple-ocsp \
        --must-staple \
        --email ryan@manaknight.com \
        -d ${project}.manaknightdigital.com

    # Reload Nginx again after SSL configuration
    sudo systemctl reload nginx
fi

echo "✅ Deployment completed successfully!"

`;
};
