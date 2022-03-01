import uuid
from django.db import models
from users.models import TimeStampMixin, User
from django.db.models.signals import post_save
from django.dispatch import receiver



class Tag(TimeStampMixin):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=30)

    def __str__(self):
        return self.title

    

class Product(TimeStampMixin):
    seller = models.ForeignKey(User, on_delete=models.CASCADE , null=True, blank= True) 
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    tags = models.ManyToManyField(Tag)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    title = models.CharField(max_length=200)  
    detail = models.TextField() 
    price = models.FloatField(default=0) 
    close_time = models.DateTimeField(null=True, blank=True) 
    open_time = models.DateTimeField(null=True, blank=True) 
    link_video = models.URLField(null=True,blank=True)
    is_active= models.BooleanField(default=True)
    STATUS_CHOICES = (
        ('out of stock', 'out of stock'),
        ('timeout', 'timeout'),
        ('inactive', 'inactive'),
        ('active', 'active'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES , null=True, blank= True)
    stock=models.PositiveIntegerField(null=True, blank= True)
    TYPE_CHOICES = (
        ('acution', 'auction'),
        ('limited', 'limited'),
    )
    type=models.CharField(null=True, blank= True,choices=TYPE_CHOICES,max_length=20)
    task_id = models.CharField(max_length=1000,null=True, blank= True) 
    firebasekey=models.CharField(max_length=1000,null=True, blank= True) 
    
    @property
    def get_highest_bid(self):
        try:
            return self.bids.filter().order_by('-price')[0].price
        except:
            return 0
    
    def __str__(self):
        return self.seller.name + ' ' + self.title
    

    
class Bid(TimeStampMixin):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    price=models.PositiveIntegerField(default=0)
    product = models.ForeignKey(Product, related_name='bids',on_delete=models.CASCADE,null=True,blank= True)
    user = models.ForeignKey(User, related_name='bids',on_delete=models.CASCADE,null=True,blank= True)
    
    def __str__(self):
        return str(self.price)
    
class Image(TimeStampMixin):
    is_featured=models.BooleanField(default=False)
    image = models.ImageField(upload_to='product_images')
    product = models.ForeignKey(Product, related_name='images',on_delete=models.CASCADE,null=True,blank= True)
    
class Order(TimeStampMixin):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    price=models.FloatField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE , null=True, blank= True) 
   
    def __str__(self):
        return str(self.price)
    
class OrderProduct(TimeStampMixin):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    quantity=models.FloatField(default=0)
    order = models.ForeignKey(Order, on_delete=models.CASCADE , null=True, blank= True) 
    product = models.ForeignKey(Product, on_delete=models.CASCADE , null=True, blank= True)
   
    def __str__(self):
        return str(self.quantiy)
    

    
    
    
    
