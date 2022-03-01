from django.core.management.base import BaseCommand
from product.models import Product,Tag,Image,Bid,Order,OrderProduct
from users.models import User
import base64
import json
from product.tasks import status_update
from django.core.files import File
from product.firebase import add_product,delete_product
import io

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        self.clean_database()
        file = open('./seed.json')
        products = json.loads(file.read())['products']

        user = self.create_user()

        for product in products:
            self.create_product(product,user)

        file.close()

    def create_product(self,product_dictiory,user):
        images = product_dictiory.get('images')
        tags=product_dictiory.get('tags')
        title=product_dictiory.get('title')
        detail=product_dictiory.get('detail')
        price=product_dictiory.get('price')
        close_time=product_dictiory.get('close_time')
        open_time=product_dictiory.get('open_time')
        link_video=product_dictiory.get('link_video')
        status=product_dictiory.get('status')
        stock=product_dictiory.get('stock')
        type=product_dictiory.get('type')
            
                
        product=Product.objects.create(seller=user,title=title,detail=detail,
                                    price=price,close_time=close_time,open_time=open_time,
                                    link_video=link_video,status=status,stock=stock,
                                    type=type)
                
        task_id=status_update.apply_async((product.uuid,), eta=product.close_time)
        product.task_id=task_id

        for data in tags:
            obj, created = Tag.objects.get_or_create(title=data)
            product.tags.add(obj)
                        
        product.save()

        for imagedata in images:
            is_featured=imagedata['is_featured']
            image=imagedata['image']

            temp , imagestr = image.split(';base64,')
            ext = temp.split('/')[-1]
            image_data = base64.b64decode(imagestr)
            image = File(io.BytesIO(image_data), name= 'image.'+ ext)
            images=Image.objects.create(image=image,is_featured=is_featured,product=product)
            images.save()


        """ firebase """
        add_product(product)

    def create_user(self):
        user = User.objects.create(
            username="jeebok-customer",
            email='jeebok-customer@gmail.com',
            phone_number="+123456789",
            name="Mr Jeebook",
            gender="M",
            birthday="2018-03-29",
            is_seller=True
            
        )
        user.set_password("12345678åå")
        user.save()
        return user
       
    def clean_database(self):
        OrderProduct.objects.all().delete()
        Order.objects.all().delete()
        Bid.objects.all().delete()
        Image.objects.all().delete()
        
        products = Product.objects.all()
        for product in products:
            delete_product(product)

        Product.objects.all().delete()

        User.objects.filter(is_superuser=False).delete()


