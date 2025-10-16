#!/bin/bash

echo "Dizitup Project Setup Script"
echo "==========================="

# Check if Node.js is installed
echo "Checking for Node.js installation..."
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
echo "Checking for npm installation..."
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install Node.js from https://nodejs.org/ which includes npm"
    exit 1
fi

echo "Node.js and npm are installed."

# Install project dependencies
echo "Installing project dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo "Dependencies installed successfully!"

# Create a start script for development
echo "Creating start script..."
echo "npm run dev" > start.sh
chmod +x start.sh

echo "Setup complete!"
echo "To start the development server, run './start.sh' or execute 'npm run dev' in the terminal"