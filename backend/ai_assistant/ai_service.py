import requests


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen2.5:0.5b"


def ask_ai(question):
    prompt = f"""
You are the PetCare Hub AI Assistant.

Help users with general pet care questions about:
feeding, grooming, exercise, hygiene, behavior, and general health.

Give simple and practical answers.

Do not diagnose diseases or prescribe medicine.
If the situation may be serious or urgent, recommend
contacting a qualified veterinarian.

User question:
{question}
"""

    response = requests.post(
    OLLAMA_URL,
    json={
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_predict": 250,
        },
    },
    timeout=300,
)

    response.raise_for_status()

    data = response.json()

    return data["response"]