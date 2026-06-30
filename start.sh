#!/bin/bash

# SkillForge AI - Quick Start Script
# This script helps you set up and run the project quickly

echo "🚀 SkillForge AI - Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Firebase is configured
if grep -q "YOUR_API_KEY" src/firebase.js; then
    echo "⚠️  WARNING: Firebase not configured!"
    echo ""
    echo "Before running the app, you need to:"
    echo "1. Create a Firebase project at https://console.firebase.google.com"
    echo "2. Enable Email/Password Authentication"
    echo "3. Create a Firestore Database"
    echo "4. Copy your Firebase config"
    echo "5. Update src/firebase.js with your credentials"
    echo ""
    echo "📖 See SETUP.md for detailed instructions"
    echo ""
    read -p "Have you configured Firebase? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Please configure Firebase first, then run this script again."
        echo "Quick guide: https://console.firebase.google.com"
        exit 1
    fi
fi

echo "🎉 Everything looks good!"
echo ""
echo "Starting development server..."
echo "The app will open at http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
