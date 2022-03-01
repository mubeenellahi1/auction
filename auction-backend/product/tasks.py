from product.firebase import update_status
from celery import shared_task

from .models import Product


@shared_task
def status_update(product_uuid):
    product = Product.objects.get(uuid=product_uuid)
    product.status = 'timeout'
    product.save()
    update_status(product)
    
    