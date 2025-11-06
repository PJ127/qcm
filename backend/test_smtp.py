#!/usr/bin/env python3
"""
Quick SMTP connection test script
Tests if you can connect to your SMTP server
"""
import asyncio
import aiosmtplib
import os
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
import aiosmtplib
from aiosmtplib import SMTP
import asyncio
load_dotenv()

# Get configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.ionos.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "contact@pourquoi-vacciner.fr")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "changethis")
SMPT_USER = "contact@pourquoi-vacciner.fr"

async def test_smtp():
    """Test SMTP connection"""
    print(f"Testing connection to {SMTP_HOST}:{SMTP_PORT}")
    print(f"Username: {SMTP_USER}")
    print("-" * 50)
    
    try:
        if SMTP_PORT == 465:
            print("Using SSL/TLS connection (port 465)...")
            if SMTP_PORT == 465:
            # async with aiosmtplib.SMTP(hostname=SMTP_HOST, port=SMTP_PORT, use_tls=True) as smtp:
                smtp = SMTP(
                    hostname="smtp.ionos.fr",  # Serveur SMTP d'IONOS
                    port=465,  # ou 587 pour STARTTLS
                    use_tls=True,  # Obligatoire pour le port 587
                )                
                print("✓ Connected to SMTP server")
                
                if SMTP_USER and SMTP_PASSWORD:
                    # await smtp.login(SMTP_USER, SMTP_PASSWORD)
                    await smtp.connect()
                    await smtp.login(
                        SMTP_USER,
                        SMTP_PASSWORD
                    )                    
                    print("✓ Authentication successful")
                else:
                    print("⚠ No credentials provided, skipping authentication")
                
                print("\n✓ Connection test passed!")
        else:
            print(f"Using STARTTLS connection (port {SMTP_PORT})...")
            async with aiosmtplib.SMTP(hostname=SMTP_HOST, port=SMTP_PORT) as smtp:
                print("✓ Connected to SMTP server")
                
                if SMTP_PORT == 587:
                    await smtp.starttls()
                    print("✓ STARTTLS successful")
                
                if SMTP_USER and SMTP_PASSWORD:
                    await smtp.login(SMTP_USER, SMTP_PASSWORD)
                    print("✓ Authentication successful")
                else:
                    print("⚠ No credentials provided, skipping authentication")
                
                print("\n✓ Connection test passed!")
                
    except Exception as e:
        print(f"\n✗ Connection test failed!")
        print(f"Error: {type(e).__name__}: {e}")
        import traceback
        print("\nFull traceback:")
        print(traceback.format_exc())
        return False
    
    return True

if __name__ == "__main__":
    print("=" * 50)
    print("SMTP Connection Test")
    print("=" * 50)
    
    if not SMTP_HOST or SMTP_HOST == "localhost":
        print("⚠ Warning: SMTP_HOST not configured properly")
    
    result = asyncio.run(test_smtp())
    
    print("=" * 50)
    if result:
        print("Result: SUCCESS")
    else:
        print("Result: FAILED")
        print("\nNext steps:")
        print("1. Verify SMTP_HOST is correct for your provider")
        print("2. Check your firewall allows outbound SMTP connections")
        print("3. Verify SMTP_USER and SMTP_PASSWORD are correct")
        print("4. Try port 587 if port 465 doesn't work (or vice versa)")
    print("=" * 50)

# import aiosmtplib
# from aiosmtplib import SMTP
# import asyncio

# async def send_email():
#     smtp = SMTP(
#         hostname="smtp.ionos.fr",  # Serveur SMTP d'IONOS
#         port=465,  # ou 587 pour STARTTLS
#         use_tls=True,  # Obligatoire pour le port 587
#     )
#     try:
#         await smtp.connect()
#         await smtp.login(
#             "contact@pourquoi-vacciner.fr",  # Adresse email complète
#             "changethis",  # Mot de passe IONOS
#         )
#         print("good")
#         # Envoie l'email...
#     except aiosmtplib.errors.SMTPAuthenticationError as e:
#         print(f"Erreur d'authentification: {e}")
#     finally:
#         await smtp.quit()

# if __name__ == "__main__":
#     asyncio.run(send_email())