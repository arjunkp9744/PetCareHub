import os
from google import genai


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_ai(question):
    prompt = f"""
You are the PetCare Hub AI Assistant.

Help users with general pet care questions about:
feeding, grooming, exercise, hygiene, behavior, and general health.

Give simple and practical answers.

Do not diagnose diseases or prescribe medicine.
Do not prescribe or recommend specific medicines.
If the situation may be serious or urgent, recommend
contacting a qualified veterinarian.

User question:
{question}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text