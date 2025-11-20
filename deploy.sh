#!/bin/bash

# Build and Deploy Script for Hostinger
# Usage: ./deploy.sh

echo "🚀 Starting deployment process..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 3: Prepare deployment package
echo "📁 Preparing deployment files..."

# Create deployment directory
mkdir -p deploy
rm -rf deploy/*

# Copy dist files
cp -r dist/* deploy/

# Copy API files
cp -r api deploy/

# Copy .htaccess
cp public/.htaccess deploy/

# Copy deployment instructions
cp DEPLOYMENT.md deploy/

echo "✅ Deployment package ready in ./deploy folder"
echo ""
echo "📋 Next steps:"
echo "1. Upload all files from ./deploy to your Hostinger public_html/"
echo "2. Create .env file on server with database credentials"
echo "3. Import api/setup/schema.sql to your MySQL database"
echo "4. Test at your domain"
echo ""
echo "Or use Git deployment (see DEPLOYMENT.md)"
