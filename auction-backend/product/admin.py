from product.models import Bid, Order, OrderProduct, Product, Tag,Image
from django.contrib import admin

admin.site.register(Product)
admin.site.register(Tag)
admin.site.register(Bid)
admin.site.register(Image)
admin.site.register(Order)
admin.site.register(OrderProduct)

