from django.core.mail import send_mail
from django.conf import settings
from .models import Contact

def send_contact_notification(contact_id):
    """Send notification email when a new contact form is submitted."""
    try:
        contact = Contact.objects.get(id=contact_id)
        subject = f'New Contact Form Submission - {contact.service_type}'
        message = f"""
New contact form submission:

Name: {contact.name}
Email: {contact.email}
Service: {contact.service_type}
Message:
{contact.message}

Submitted at: {contact.created_at}
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        
    except Contact.DoesNotExist:
        pass  # Log this error in production
    except Exception as e:
        pass  # Log this error in production
