import { gapi } from 'gapi-script';

// Get credentials from environment variables (Vite requires VITE_ prefix)
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

// Validate that required environment variables are set
if (!CLIENT_ID) {
  console.error('VITE_GOOGLE_CLIENT_ID is not set in .env file');
}
if (!API_KEY) {
  console.error('VITE_GOOGLE_API_KEY is not set in .env file');
}

let gapiInitialized = false;

export const initializeGapi = () => {
  return new Promise((resolve, reject) => {
    if (gapiInitialized) {
      resolve();
      return;
    }

    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        })
        .then(() => {
          gapiInitialized = true;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    };

    if (!gapiInited) {
      gapi.load('client:auth2', initClient);
    } else {
      initClient();
    }
  });
};

export const signIn = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

export const signOut = () => {
  return gapi.auth2.getAuthInstance().signOut();
};

export const listEvents = (calendarId = 'primary') => {
  return gapi.client.calendar.events.list({
    calendarId,
    maxResults: 10,
    orderBy: 'startTime',
    singleEvents: true,
  });
};

export const createEvent = (event, calendarId = 'primary') => {
  return gapi.client.calendar.events.insert({
    calendarId,
    resource: event,
  });
};
