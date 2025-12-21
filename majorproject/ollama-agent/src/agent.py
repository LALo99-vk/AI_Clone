from langchain_ollama import ChatOllama
from email_tools import send_email
from meeting_tools import schedule_meeting

# Set up your Ollama LLM (use your model's name)
llm = ChatOllama(model="my-custom-model-short", temperature=0)

def run_ai_agent(prompt):
    # Basic example: route prompt by keywords (expand with NLP if needed)
    if "schedule meeting" in prompt.lower():
        return schedule_meeting(prompt)
    elif "email" in prompt.lower() or "mail" in prompt.lower():
        return send_email(prompt)
    else:
        # Fallback to LLM response for general queries
        return llm.invoke(prompt)

