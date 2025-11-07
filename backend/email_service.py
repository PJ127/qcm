import os
import logging
import traceback
import base64
import mimetypes
from urllib.parse import quote
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
import aiosmtplib
from dotenv import load_dotenv
import aiosmtplib
from aiosmtplib import SMTP
import asyncio

load_dotenv()

# Email configuration from environment variables
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.ionos.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "contact@pourquoi-vacciner.fr")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "contact@pourquoi-vacciner.fr")
TO_EMAIL = os.getenv("TO_EMAIL", "contact@pourquoi-vacciner.fr")

# Log configuration (without sensitive data)
logging.basicConfig(level=logging.INFO)
logging.info(f"SMTP configured: {SMTP_HOST}:{SMTP_PORT}")


def attach_file_to_message(msg: MIMEMultipart, file_data: bytes, filename: str):
    """
    Attach a file to an email message.
    
    Args:
        msg: The MIMEMultipart message to attach to
        file_data: The file data as bytes
        filename: The name of the file
    """
    # Detect MIME type based on file extension
    mime_type, _ = mimetypes.guess_type(filename)
    if mime_type is None:
        mime_type = 'application/octet-stream'
    
    main_type, sub_type = mime_type.split('/', 1)
    
    attachment = MIMEBase(main_type, sub_type)
    attachment.set_payload(file_data)
    encoders.encode_base64(attachment)
    
    # Encode filename properly to handle special characters and non-ASCII
    # Use a format that's compatible with most email clients
    try:
        # Try to encode as ASCII first
        filename.encode('ascii')
        # ASCII-only filename, use simple quoted format
        attachment.add_header(
            'Content-Disposition',
            f'attachment; filename="{filename}"'
        )
    except UnicodeEncodeError:
        # Non-ASCII characters, use RFC 5987 format (filename*=UTF-8''encoded)
        # URL-encode the filename to avoid issues
        encoded_filename = quote(filename.encode('utf-8'))
        attachment.add_header(
            'Content-Disposition',
            f'attachment; filename="{filename}"; filename*=UTF-8\'\'{encoded_filename}'
        )
    
    msg.attach(attachment)


async def send_contact_email(
    sender_email: str,
    sender_name: str = "",
    sender_prenom: str = "",
    raison: str = "",
    message: str = "",
    contact_type: str = "contact",
    attachments: list = None,
):
    """
    Send a contact email from the domain email with reply-to set to sender
    and a copy sent to the sender.
    
    Args:
        sender_email: The email address of the person sending the message
        sender_name: The name (nom) of the sender
        sender_prenom: The first name (prénom) of the sender
        raison: The reason for contact (correction, question, autre, etc.)
        message: The message body
        contact_type: Either "contact" or "contribuer"
        attachments: List of dicts with 'data' (base64 string) and 'filename' (string)
    
    Returns:
        bool: True if email was sent successfully
    """
    try:
        # Determine subject based on contact type
        subject_prefix = "Contribution" if contact_type == "contribuer" else "Contact"
        subject = f"{subject_prefix} - Pourquoi Vacciner"
        
        # Format raison text
        raison_text = {
            "correction": "Apporter une correction",
            "question": "Proposer une question",
            "courbes": "Donner des courbes officielles",
            "autre": "Autre"
        }.get(raison, raison)
        
        # Build email body
        email_body = f"""Nom: {sender_name or "Non renseigné"}
Prénom: {sender_prenom or "Non renseigné"}
Raison: {raison_text}
Courriel: {sender_email}

Message:
{message}
"""
        
        # Create email message to contact@pourquoi-vacciner.fr
        msg_to_admin = MIMEMultipart()
        msg_to_admin["From"] = FROM_EMAIL
        msg_to_admin["To"] = TO_EMAIL
        msg_to_admin["Reply-To"] = sender_email
        msg_to_admin["Subject"] = subject
        msg_to_admin.attach(MIMEText(email_body, "plain", "utf-8"))
        
        # Create copy email to sender
        msg_to_sender = MIMEMultipart()
        msg_to_sender["From"] = FROM_EMAIL
        msg_to_sender["To"] = sender_email
        msg_to_sender["Subject"] = f"Copie de votre message - {subject}"
        msg_to_sender_body = f"""Bonjour,

Merci pour votre message. En voici une copie :

{email_body}

Nous vous répondrons dès que possible.

Cordialement,
Pourquoi Vacciner
"""
        msg_to_sender.attach(MIMEText(msg_to_sender_body, "plain", "utf-8"))
        if attachments:
            for att in attachments:
                try:
                    file_data = base64.b64decode(att['data'])
                    filename = att['filename']
                    attach_file_to_message(msg_to_admin, file_data, filename)
                    attach_file_to_message(msg_to_sender, file_data, filename)
                except Exception as e:
                    logging.warning(f"Failed to attach file {att.get('filename', 'unknown')}: {e}")
        smtp = SMTP(
            hostname="smtp.ionos.fr",  
            port=465,  
            use_tls=True, 
        )                  
        if SMTP_USER and SMTP_PASSWORD:
            await smtp.connect()
            await smtp.login(SMTP_USER, SMTP_PASSWORD)
        
        # Send email to admin
        await smtp.send_message(msg_to_admin)
        
        # Send copy to sender
        await smtp.send_message(msg_to_sender)
        
        return True
        
    except Exception as e:
        logging.error(f"Error sending email to {sender_email}: {type(e).__name__}: {e}")
        logging.error(traceback.format_exc())
        return False

