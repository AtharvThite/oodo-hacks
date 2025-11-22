# Gmail OAuth Setup Guide for OTP Email Service

## Step-by-Step Setup for kartikshenoy789@gmail.com

### 1. Enable Gmail API and Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "StockMaster OTP Service"
3. Enable these APIs:
   - Gmail API
   - Google+ API

4. Create OAuth 2.0 credentials (Service Account):
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Name: "StockMaster Backend"
   - Add authorized redirect URIs:
     - `http://localhost:5000/auth/callback`
     - `http://localhost:5000`

5. Download the JSON file and save credentials

### 2. Generate Gmail App Password (Recommended - Simple Method)

**This is the easiest approach:**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)
3. Go to "App passwords"
4. Select "Mail" and "Windows Computer"
5. Google generates a 16-character password
6. Copy this password - this is your SMTP_PASSWORD

### 3. Update Backend .env File

Add these lines to `/backend/.env`:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=kartikshenoy789@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # 16-character app password from step 2
SMTP_FROM_NAME=StockMaster
OTP_EXPIRY=10  # minutes
MAX_OTP_ATTEMPTS=5
```

### 4. Verify Configuration

Run this test command:
```bash
cd backend
npm test -- email
```

## Troubleshooting

### "Authentication failed" Error
- Verify app password is correct (16 characters with spaces)
- Ensure 2FA is enabled on Gmail account
- Check SMTP_PORT is 587 (not 465 for STARTTLS)

### "Less secure app access" Error
- This is deprecated by Google
- Use App Password method instead (Step 2)

### Email Not Sending
- Check SMTP_EMAIL matches Gmail address
- Verify no typos in SMTP_PASSWORD
- Check that sender email has proper permissions

## Testing OTP Email Sending

After setup, test with curl:

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "OTP sent to email",
  "expiresIn": 600
}
```

## Security Notes

1. **OTP Expiry**: Set to 10 minutes (600 seconds)
2. **Max Attempts**: 5 failed verification attempts before rate limiting
3. **OTP Length**: 6 digits for good balance of security and usability
4. **Database**: OTPs stored in MongoDB with expiration timestamps
5. **Rate Limiting**: Implement IP-based rate limiting for /send-otp endpoint

## Production Deployment

For production:

1. Use environment variables for all credentials
2. Set `OTP_EXPIRY=5` (5 minutes)
3. Set `MAX_OTP_ATTEMPTS=3`
4. Enable rate limiting on OTP routes
5. Consider using SendGrid or AWS SES instead of Gmail for higher volume
6. Implement OTP attempt logging for audit trails

## Cost

- Gmail API: FREE for up to 100,000 API calls/month
- App passwords: FREE
- Nodemailer: FREE (open source)
- Total cost: $0 for standard usage
