import datetime
import os.path
import uuid
from typing import Optional
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Scope: full calendar access
SCOPES = ['https://www.googleapis.com/auth/calendar']

# Step 1: Authorize user and store token
def get_calendar_service():
    """
    Authenticates with Google Calendar API and returns a service object.
    
    Returns:
        googleapiclient.discovery.Resource: Authenticated Calendar service object
    """
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If no valid credentials, do OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save token
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('calendar', 'v3', credentials=creds)

# Step 2: Create event with Meet link + guest invites
def create_meet_event(
    attendee_emails: list[str],
    start_time: Optional[datetime.datetime] = None,
    end_time: Optional[datetime.datetime] = None
) -> dict:
    """
    Creates a Google Calendar event with an automatically generated Google Meet link
    and sends email invitations to specified attendees.
    
    Args:
        attendee_emails (list[str]): A list of email addresses to invite to the meeting.
        
        start_time (Optional[datetime.datetime]): Start time of the meeting.
                                                 If not provided, defaults to current time.
                                                 Format: datetime.datetime object
                                                 Example: datetime.datetime(2025, 6, 18, 9, 0, 0)
        
        end_time (Optional[datetime.datetime]): End time of the meeting.
                                               If not provided, defaults to 1 hour after start_time.
                                               Format: datetime.datetime object
                                               Example: datetime.datetime(2025, 6, 18, 10, 0, 0)
    
    Returns:
        dict: A dictionary containing the created event details including:
              - summary: Event title
              - hangoutLink: Google Meet video conference link
              - htmlLink: Google Calendar event link
              - id: Unique event identifier
              - start: Event start time
              - end: Event end time
    
    Logic:
        1. Authenticates with Google Calendar API using OAuth2
        2. Generates a unique requestId using uuid4() for the conference data
        3. Sets default start_time to current time if not provided
        4. Sets default end_time to 1 hour after start_time if not provided
        5. Creates event with Google Meet integration enabled
        6. Sends email invitations to all attendees
        7. Returns event details including the Meet link
    
    Example:
        >>> create_meet_event(["user@example.com"])
        >>> create_meet_event(["user@example.com"], 
        ...                   start_time=datetime.datetime(2025, 6, 18, 9, 0, 0),
        ...                   end_time=datetime.datetime(2025, 6, 18, 10, 30, 0))
    """
    print(f"[create_meet_event] Called with attendee_emails: {attendee_emails}, start_time: {start_time}, end_time: {end_time}")
    service = get_calendar_service()
    
    # Set default start time to current time if not provided
    if not start_time:
        start_time = datetime.datetime.now()
    
    # Set default end time to 1 hour after start time if not provided
    if not end_time:
        end_time = start_time + datetime.timedelta(hours=1)
    
    # Generate unique requestId for conference data using uuid4
    unique_request_id = str(uuid.uuid4())
    
    event = {
        'summary': 'Doubt solving meet',
        'description': 'Doubt solveing Meet Between Student and teacher',
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'attendees': [{'email': email} for email in attendee_emails],
        'conferenceData': {
            'createRequest': {
                'requestId': unique_request_id,  # Unique identifier for each meeting
                'conferenceSolutionKey': {'type': 'hangoutsMeet'}
            }
        }
    }

    created_event = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1,
        sendUpdates='all'  # sends email invites
    ).execute()

    print("Event created:")
    print("Summary:", created_event['summary'])
    print("Meet link:", created_event['hangoutLink'])
    print("Event Link:", created_event['htmlLink'])
    print(f"[create_meet_event] Event created: {created_event}")
    
    # Return the created event details for programmatic access
    return {
        'summary': created_event['summary'],
        'hangoutLink': created_event['hangoutLink'],
        'htmlLink': created_event['htmlLink'],
        'id': created_event['id'],
        'start': created_event['start'],
        'end': created_event['end']
    }

