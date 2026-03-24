from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from llama_cpp import Llama
import time
from datetime import datetime

app = FastAPI()

model_path = "/Users/vineeshkumar/Desktop/huddingmodel/gemma-3-4b-it-UD-IQ1_S.gguf"

try:
    llm = Llama(model_path=model_path)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    llm = None

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_root():
    return FileResponse('static/index.html')

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    if llm is None:
        return {
            "response": "Model not loaded. Please check the model file.",
            "timestamp": datetime.now().isoformat(),
            "status": "error"
        }
    try:
        output = llm(user_message, max_tokens=200, echo=False)
        bot_response = output["choices"][0]["text"].strip()
        return {
            "response": bot_response,
            "timestamp": datetime.now().isoformat(),
            "status": "success",
            "model": "Gemma-3-4B-IT"
        }
    except Exception as e:
        return {
            "response": f"Error generating response: {str(e)}",
            "timestamp": datetime.now().isoformat(),
            "status": "error"
        }

@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    data = await request.json()
    messages = data.get("messages", [])
    if not messages:
        return {"error": "No messages provided"}
    
    # Extract the last user message
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            content = msg.get("content", "")
            if isinstance(content, list):
                for item in content:
                    if item.get("type") == "text":
                        user_message = item.get("text", "")
                        break
            else:
                user_message = content
            break
    
    if not user_message:
        return {"error": "No user message found"}
    
    if llm is None:
        return {"error": "Model not loaded"}
    
    try:
        output = llm(user_message, max_tokens=200, echo=False)
        bot_response = output["choices"][0]["text"].strip()
        
        # Return in OpenAI format
        return {
            "id": "chatcmpl-123",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": "google/gemma-3-4b-it",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": bot_response
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": len(user_message.split()),
                "completion_tokens": len(bot_response.split()),
                "total_tokens": len(user_message.split()) + len(bot_response.split())
            }
        }
    except Exception as e:
        return {"error": str(e)}