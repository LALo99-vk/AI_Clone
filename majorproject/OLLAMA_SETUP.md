# Ollama Installation & Setup Guide

## Step 1: Install Ollama

### Option A: Using Homebrew (Recommended for macOS)
```bash
brew install ollama
```

### Option B: Download from Website
1. Visit: https://ollama.com/download
2. Download the macOS installer
3. Open the downloaded .dmg file
4. Drag Ollama to your Applications folder
5. Open Ollama from Applications (this will start the service)

## Step 2: Start Ollama Service

After installation, start the Ollama service:

```bash
ollama serve
```

This will start Ollama in the foreground. For production, you may want to run it as a background service.

**Note:** Keep this terminal window open, or run it in the background:
```bash
ollama serve &
```

Or on macOS, Ollama typically runs as a service after installation, so you might not need to manually start it.

## Step 3: Pull the Base Model

In a new terminal window:

```bash
ollama pull llama2
```

This will download the llama2 model (several GB, may take a few minutes).

## Step 4: Create the Custom Model

Navigate to your backend directory and create the custom model:

```bash
cd /Users/test/Projet6/ai-clone/majorproject/ai-clone-dashboard-backend
ollama create llama2-short -f Modelfile
```

This creates a custom model called `llama2-short` based on your Modelfile (which makes responses very short and concise).

## Step 5: Verify Installation

Check if the model was created successfully:

```bash
ollama list
```

You should see both `llama2` and `llama2-short` in the list.

Test the model directly:

```bash
ollama run llama2-short "Hello, how are you?"
```

You should get a very short, one-line response.

## Step 6: Test with Backend API

Once your backend server is running, test the chat endpoint:

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is the weather like?"}'
```

You should get a JSON response with a short AI-generated reply.

## Troubleshooting

1. **Ollama not found after installation:**
   - Make sure Ollama is in your PATH
   - Try restarting your terminal
   - On macOS, you may need to allow Ollama in System Preferences > Security & Privacy

2. **Port 11434 already in use:**
   - Ollama might already be running
   - Check: `lsof -i :11434`
   - Or just use the existing service

3. **Model not found:**
   - Make sure you've run `ollama pull llama2` first
   - Then create the custom model with `ollama create llama2-short -f Modelfile`

4. **Connection refused:**
   - Make sure `ollama serve` is running
   - Check if it's accessible: `curl http://localhost:11434/api/tags`

