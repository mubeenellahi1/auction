from django.core.management.base import BaseCommand
from product.models import Product,Image,Bid,Order,OrderProduct
from users.models import User
from product.firebase  import delete_product

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        OrderProduct.objects.all().delete()
        Order.objects.all().delete()
        Bid.objects.all().delete()
        Image.objects.all().delete()
        

        products = Product.objects.all()
        print(products)
        for product in products:
            delete_product(product)

        Product.objects.all().delete()

        User.objects.filter(is_superuser=False).delete()
