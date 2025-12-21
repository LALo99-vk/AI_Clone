# For advanced use: set up Google Calendar/Outlook API

def schedule_meeting(prompt):
    # Example: extract details (e.g., "with Divya at 10am")
    # Use regex/NLP for robust parsing in production
    import re
    match = re.search(r"with (\w+) at (\d{1,2}[ap]m)", prompt.lower())
    if match:
        person = match.group(1).title()
        time = match.group(2)
        # TODO: Use Google Calendar API to schedule real meeting
        return f"Meeting scheduled with {person} at {time}."
    return "Couldn't parse meeting details."
