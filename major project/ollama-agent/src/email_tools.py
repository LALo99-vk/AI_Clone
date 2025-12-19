# For advanced use: set up Gmail/SMTP API

def send_email(prompt):
    # Example: parse and respond (replace with real API logic)
    # Extract recipient and message (here, naive split for demo)
    if "to" in prompt.lower():
        parts = prompt.split("to")
        message = parts[0].replace("email","").strip()
        recipient = parts[1].strip()
        # TODO: Use Gmail API/smtplib to actually send email
        return f"Email to {recipient} sent: {message}"
    return "Unrecognized email format."
