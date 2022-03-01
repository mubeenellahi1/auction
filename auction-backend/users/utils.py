from base64 import urlsafe_b64encode
from users.tokens import AccountActivationTokenGenerator
from django.core.mail import EmailMultiAlternatives
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes



def email_confirmation_email(user,token,current_site):
    

    html_content = render_to_string('email_content.html', {
        'user': user,
        'domain': current_site.domain,
        'uuid':user.uuid,
        'token': token,
    })
    subject, from_email, to = 'Email Verification', 'settings.EMAIL_HOST_USER', user.email
    msg = EmailMultiAlternatives(subject, html_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    return True
