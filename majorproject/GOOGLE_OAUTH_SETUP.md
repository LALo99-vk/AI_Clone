# Google OAuth Setup - Complete Configuration

## OAuth 2.0 Client ID Configuration

When creating OAuth 2.0 credentials in Google Cloud Console, use these exact values:

### Application Type
- **Web application**

### Name
- **AI Clone Dashboard** (or any name you prefer)

### Authorized JavaScript origins
Add these URLs (one per line, or use the + button to add multiple):

```
http://localhost:5173
http://localhost:5000
```

**Why:**
- `http://localhost:5173` - Your React frontend (Vite dev server)
- `http://localhost:5000` - Your Express backend server

### Authorized redirect URIs
Add this URL:

```
http://localhost:5000/oauth2callback
```

**Why:**
- This is where Google redirects users after they authenticate
- Must match exactly what's in your backend code (`server.js` line 240)

---

## Complete Setup Steps

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Select or Create Project:**
   - Create a new project or select existing

3. **Enable APIs:**
   - Go to: https://console.cloud.google.com/apis/library
   - Enable:
     * Gmail API
     * Google Calendar API
     * (Optional) Google Classroom API

4. **Create OAuth Credentials:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Web application**
   - Name: **AI Clone Dashboard**
   
5. **Configure URLs:**
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   http://localhost:5000
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:5000/oauth2callback
   ```

6. **Download credentials:**
   - Click "Create"
   - Click download button (arrow icon)
   - Save as: `credentials.json`
   - Place in: `ai-clone-dashboard-backend/credentials.json`

7. **Authenticate:**
   - Make sure backend is running: `npm run dev` in `ai-clone-dashboard-backend`
   - Visit: `http://localhost:5000/login/google`
   - Sign in with Google account
   - Grant permissions
   - You'll see "OAuth successful!" message
   - `token.json` will be auto-generated

---

## For Production Deployment

When deploying to production, add your production URLs:

**Authorized JavaScript origins:**
```
http://localhost:5173        (for local dev)
http://localhost:5000        (for local dev)
https://yourdomain.com       (your production frontend)
```

**Authorized redirect URIs:**
```
http://localhost:5000/oauth2callback      (for local dev)
https://yourdomain.com/oauth2callback     (your production backend)
```

---

## Notes

- ⚠️ **No trailing slashes** in JavaScript origins (use `http://localhost:5173` not `http://localhost:5173/`)
- ✅ **Trailing slash OK** in redirect URIs (`/oauth2callback` is fine)
- ✅ You can add multiple origins and redirect URIs
- ⚠️ HTTP is allowed for localhost, but production should use HTTPS
- ⚠️ The redirect URI must match EXACTLY (case-sensitive, no extra slashes)

---

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Check that redirect URI in credentials matches exactly: `http://localhost:5000/oauth2callback`
- Make sure you saved the credentials after adding the URI

**Error: "origin_mismatch"**
- Check that JavaScript origins include both `http://localhost:5173` and `http://localhost:5000`
- No trailing slashes in origins

**Frontend can't initialize Google API**
- Make sure `http://localhost:5173` is in Authorized JavaScript origins
- Check browser console for specific error messages

