from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os

# Scopes for Google Calendar (read-only example)
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']


# Load secrets from environment variables (NEVER hardcode values here)
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:5173/")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")  # Optional, not required for OAuth


# Build client configuration for OAuth flow
client_config = {
    "installed": {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uris": [GOOGLE_REDIRECT_URI],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token"
    }
}


def get_calendar_service():
    """
    Starts an OAuth flow in the browser and returns an authenticated
    Google Calendar API service client.
    """
    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
    creds = flow.run_local_server(port=8080)
    service = build('calendar', 'v3', credentials=creds)
    return service


if __name__ == "__main__":
    try:
        service = get_calendar_service()
        calendar_list = service.calendarList().list().execute()
        print("Your calendars:")
        for calendar in calendar_list.get('items', []):
            print(calendar.get('summary'))
    except Exception as e:
        print("Error:", e)
