#!/bin/bash

# AI Clone Dashboard - Service Starter Script
# This script helps start all required services

echo "=========================================="
echo "AI Clone Dashboard - Service Starter"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}✗ MongoDB is not running${NC}"
    echo "  Start MongoDB with: brew services start mongodb-community"
fi
echo ""

# Check if Ollama is installed
echo -e "${YELLOW}Checking Ollama...${NC}"
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}✓ Ollama is installed${NC}"
    # Check if Ollama service is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Ollama service is running${NC}"
    else
        echo -e "${YELLOW}⚠ Ollama is installed but service may not be running${NC}"
        echo "  Start with: ollama serve"
    fi
else
    echo -e "${RED}✗ Ollama is not installed${NC}"
    echo "  Install from: https://ollama.com/download"
fi
echo ""

# Check backend .env file
echo -e "${YELLOW}Checking backend configuration...${NC}"
if [ -f "ai-clone-dashboard-backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env file exists${NC}"
else
    echo -e "${YELLOW}⚠ Backend .env file not found (will use defaults)${NC}"
fi

if [ -f "ai-clone-dashboard-backend/credentials.json" ]; then
    echo -e "${GREEN}✓ Google OAuth credentials.json exists${NC}"
else
    echo -e "${RED}✗ Google OAuth credentials.json not found${NC}"
    echo "  See SETUP_GUIDE.txt Step 4 for instructions"
fi
echo ""

# Check if backend is already running
echo -e "${YELLOW}Checking backend server...${NC}"
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ Backend is already running on port 5000${NC}"
else
    echo -e "${YELLOW}⚠ Backend is not running${NC}"
    echo "  Start with: cd ai-clone-dashboard-backend && npm run dev"
fi
echo ""

# Check if frontend is running
echo -e "${YELLOW}Checking frontend server...${NC}"
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ Frontend is already running on port 5173${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is not running${NC}"
    echo "  Start with: cd ai-clone-dashboard && npm run dev"
fi
echo ""

echo "=========================================="
echo "Service Status Summary"
echo "=========================================="
echo ""
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:5000"
echo "Ollama:    http://localhost:11434"
echo ""
echo "For detailed setup instructions, see: SETUP_GUIDE.txt"
echo ""

