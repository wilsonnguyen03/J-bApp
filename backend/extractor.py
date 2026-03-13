import os
import json
import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

async def extract_job_data(raw_text: str) -> dict:
    """
    Sends scraped page text to Claude and returns structured job data as a dict.
    """
    prompt = f"""Extract the following fields from this job listing text.
Return ONLY a valid JSON object with no preamble, explanation, or markdown code fences.
Use null for any field you cannot find.

Fields to extract:
- company (string): Company name
- role (string): Job title
- location (string): City, state, or remote
- salary (string): Salary range if mentioned
- work_type (string): Full-time / Part-time / Contract / Casual
- experience (string): Required years of experience e.g. "2+ years"
- deadline (string): Application closing date in YYYY-MM-DD format, or null
- requirements (array of strings): Top 6 key requirements or skills
- description (string): A concise 3-sentence summary of the role

Job listing text:
{raw_text}"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    raw_response = message.content[0].text

    # Strip markdown fences if Claude wraps the JSON anyway
    cleaned = raw_response.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Retry once with a stricter prompt
        retry = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": raw_response},
                {"role": "user", "content": "Your response was not valid JSON. Return only the JSON object, nothing else."}
            ]
        )
        return json.loads(retry.content[0].text.strip())