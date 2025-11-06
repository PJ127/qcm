# Email Setup for Contact Form

## Overview

The contact form sends emails automatically through your SMTP server. When a user submits the form, two emails are sent:

1. **To admin** (`contact@pourquoi-vacciner.fr`): The full message with `Reply-To` header set to the sender's email
2. **To sender** (copy): Confirmation with their message content

## Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.yourdomain.com          # Your SMTP server hostname
SMTP_PORT=587                           # Usually 587 for TLS, 465 for SSL
SMTP_USER=contact@pourquoi-vacciner.fr  # SMTP username
SMTP_PASSWORD=your_smtp_password        # SMTP password

# Email Addresses
FROM_EMAIL=contact@pourquoi-vacciner.fr # Sender address
TO_EMAIL=contact@pourquoi-vacciner.fr   # Recipient address (where messages go)
```

### Example Configurations

#### Using Gmail SMTP

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@pourquoi-vacciner.fr
SMTP_PASSWORD=your_app_specific_password
```

#### Using SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

#### Using Local SMTP for Development

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
```

For local development, you can use a tool like [MailHog](https://github.com/mailhog/MailHog) or [MailCatcher](https://mailcatcher.me/) to catch emails.

## API Endpoint

The contact form sends POST requests to:

```
http://localhost:8000/contact/
```

Request body:

```json
{
  "email": "sender@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "raison": "correction",
  "message": "Message content here",
  "contact_type": "contact"
}
```

## Installation

Install the required Python packages:

```bash
cd backend
pip install -r requirements.txt
```

The new dependencies are:

- `aiosmtplib`: For asynchronous SMTP email sending
- `python-dotenv`: For loading environment variables from `.env` file

## Testing

1. Start the backend server:

```bash
cd backend
uvicorn main:app --reload
```

2. Test the contact endpoint:

```bash
curl -X POST http://localhost:8000/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "nom": "Test",
    "prenom": "User",
    "raison": "autre",
    "message": "This is a test message",
    "contact_type": "contact"
  }'
```

## Security Notes

- Never commit your `.env` file with real credentials to version control
- Use app-specific passwords for Gmail
- Consider using environment variables directly in production (without .env file)
- The `.env` file is already in `.gitignore` if properly configured

## Troubleshooting

### "Failed to send email" error

1. Check your SMTP credentials are correct in `.env`
2. Verify SMTP host and port are correct for your email provider
3. Check firewall/network allows SMTP connections
4. For Gmail, ensure you're using an app-specific password, not your regular password
5. Check server logs for detailed error messages

### Emails not received

1. Check spam/junk folders
2. Verify your email provider's SMTP settings
3. Check if there are any rate limits on your SMTP server
4. Verify the `TO_EMAIL` address is correct
