import { gapi } from 'gapi-script';

const CLIENT_ID = '"695033161929-pm35jsau87s7kbi1kj9dpa8368bvsqqu.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
const API_KEY = 'AIzaSyCpxsir2xitRYEc4z8yb53Hb9Prl7PYC6Q'; // Replace with your Google API key
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

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
