import json
from django.core.mail import EmailMessage
import logging
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from blog.models import *
from .models import (
    Service,
    Portfolio,
    TeamMember,
    Stats,
    Testimonial,
    BlogPost,
    Contact
)

logger = logging.getLogger(__name__)

def home(request):
    """Single view to serve our index page with all required data"""
    context = {
        'services': Service.objects.all(),
        'portfolio': Portfolio.objects.all(),
        'team': TeamMember.objects.all(),
        'stats': Stats.objects.first(),  # We only need one instance
        'testimonials': Testimonial.objects.all(),
        'blog_posts': Article.objects.all()  # Latest 3 posts
    }
    return render(request, 'index.html', context)

@require_http_methods(["POST"])
def contact_submit(request):
        if request.method=="POST":
            if request.content_type == 'application/json':
                import json
                data = json.loads(request.body)
            else:
                data = request.POST
            
            # Validate required fields
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')
            service = data.get('service')
            message = data.get('message')
            
            if not all([name, email, phone, service, message]):
                return JsonResponse({
                    'success': False,
                    'message': 'All fields are required.'
                }, status=400)
            
            contact = Contact.objects.create(
                name=name,
                email=email,
                phone=phone,
                service=service,
                message=message
            )
            email_subject = f'New Contact Form Submission - {service}'
            email_body = f"""
New contact form submission from Techno Graphix website:

Name: {name}
Email: {email}
Phone: {phone}
Service Interested: {service}

Message:
{message}

---
This is an automated message from your website contact form.
                    """
            EmailMessage(email_subject, email_body, 'virvphruria@gmail.com', ['viir.technographix@gmail.com']).send()
        return JsonResponse({
            'success': True, 
            'message': 'Thank you! We\'ll get back to you soon.'
        })
        

def portfolio_filter(request, category=None):
    """AJAX endpoint for portfolio filtering"""
    queryset = Portfolio.objects.all().order_by('order')
    if category and category != 'all':
        queryset = queryset.filter(category=category)
    
    items = [{
        'title': item.title,
        'description': item.description,
        'image': item.image.url if item.image else None,
        'category': item.category,
        'slug': item.slug
    } for item in queryset]
    
    return JsonResponse({'items': items})