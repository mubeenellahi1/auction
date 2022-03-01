from os import close
from product.firebase import add_product, update_highestBid, update_product, update_stock,\
    delete_product
from users.models import User
from django.shortcuts import render
from product.models import Order, OrderProduct, Product
from rest_framework import status
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from product.serializers import *
import json
import base64
from django.core.files import File
import io
from datetime import datetime
from .tasks import *
import pytz
from config import celery_app
utc=pytz.UTC


# Create your views here.



class CRUDProduct(viewsets.ModelViewSet):
    
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated,)
    
    def create(self, request):
        try:
            user = request.user
            images = request.data.get('images')
            tags=request.data.get('tags')
            title=request.data.get('title')
            detail=request.data.get('detail')
            price=request.data.get('price')
            close_time=request.data.get('close_time')
            open_time=request.data.get('open_time')
            link_video=request.data.get('link_video')
            status=request.data.get('status')
            stock=request.data.get('stock')
            type=request.data.get('type')
            
            if close_time > open_time:
                
                product=Product.objects.create(seller=user,title=title,detail=detail,
                                            price=price,close_time=close_time,open_time=open_time,
                                            link_video=link_video,status=status,stock=stock,
                                            type=type)
                
                task_id=status_update.apply_async((product.uuid,), eta=product.close_time)
                product.task_id=task_id
                product.save()
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
                    
                return Response({
                    'status': 'success',
                    'Message':'product is created' ,
                    'data':{"product_uuid": product.uuid}
                    })
            else:
                return Response({
                'status': 'failed',
                'Message':'close time should be greater then open time' ,
                'data':""
                })
                
        except Exception as e:
            return Response({
                "status":"failure",
                "message": "Request cannot be proceeded- " + str(e),
                'data':{""}
                },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    def remove(self, request):
        try:
            uuid = request.data.get('product_uuid')
            product=Product.objects.get(uuid=uuid)
            Product.objects.filter(uuid=uuid).delete()
            delete_product(product)
            return Response({
                "status":"success",
                'Message':'Product is removed',
                'data':{""}})
        except Exception as e:
            return Response({
                "status":"failure",
                "message": "Request cannot be proceeded- " + str(e),
                'data':{""}
                },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    def retrieve(self,request):
        try:
            uuid = request.GET.get('product_uuid')
            product=Product.objects.get(uuid=uuid)
            product = ProductSerializer(product)
            return Response({
                "status":"success",
                'Message':'Product is Retrieved',
                'data':product.data})
        except Exception as e:
            return Response({
                "status":"failure",
                "message": "Request cannot be proceeded- " + str(e),
                'data':{""}
                },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def list(self,request):
            try:
                page = int(request.GET.get('page'))-1
                page_size=15
                start=page*page_size
                end=start+page_size
                products=Product.objects.filter(is_active=True)[start:end]
                total_pages=int(len(products)/page_size) +1
                json_product = ProductSerializer(products,many=True)
                return Response({
                    "status":"success",
                    'Message':'All Products',
                    'data':{"pages":total_pages,"product":json_product.data}})
            except Exception as e:
                return Response({
                    "status":"failure",
                    "message": "Request cannot be proceeded- " + str(e),
                    'data':{""}
                    },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def myProducts(self,request):
            try:
                user = request.user
                page = int(request.GET.get('page'))-1
                page_size=15
                start=page*page_size
                end=start+page_size
                
                all_products=Product.objects.filter(seller=user)

                products=Product.objects.filter(seller=user)[start:end]
                total_pages=int(len(all_products)/page_size) + 1
                
                json_products = ProductSerializer(products,many=True)
                
                return Response({
                    "status":"success",
                    'Message':'Your Products',
                    'data':{"pages":total_pages,"products":json_products.data}})
            except Exception as e:
                return Response({
                    "status":"failure",
                    "message": "Request cannot be proceeded- " + str(e),
                    'data':{""}
                    },
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
    def update(self,request):
        try:
            product_uuid=request.data.get('product_uuid')
            images = request.data.get('images')
            tags=request.data.get('tags')
            title=request.data.get('title')
            detail=request.data.get('detail')
            price=request.data.get('price')
            close_time=request.data.get('close_time')
            open_time=request.data.get('open_time')
            link_video=request.data.get('link_video')
            # status=request.data.get('status'
            stock=request.data.get('stock')
            # type=request.data.get('type')
            
            product=Product.objects.get(uuid=product_uuid)
            
            current_date=utc.localize(datetime.now())
    
            if product.open_time > current_date and open_time < close_time:
                
                product=Product.objects.filter(uuid=product_uuid).update(title=title,detail=detail,
                                            price=price,close_time=close_time,open_time=open_time,
                                            link_video=link_video,stock=stock)
                

                product=Product.objects.get(uuid=product_uuid)
                celery_app.control.revoke(product.task_id, terminate=True)
                task_id=status_update.apply_async((product.uuid,), eta=close_time)
                product.task_id=task_id
                product.save()
                
                product.tags.clear()
                for data in tags:
                    obj, created = Tag.objects.get_or_create(title=data)
                    product.tags.add(obj)
                        
                product.save()

                existing_images = []

                for imagedata in images:
                    is_featured=imagedata['is_featured']
                    image=imagedata['image']

                    try:
                        temp , imagestr = image.split(';base64,')
                        ext = temp.split('/')[-1]
                        image_data = base64.b64decode(imagestr)
                        image = File(io.BytesIO(image_data), name= 'image.'+ ext)
                        image = Image.objects.create(image=image,is_featured=is_featured,product=product)
                        existing_images.append(image.id)

                    except:
                        image_short_url = image.split('/media/')[1]
                        image  = product.images.filter(image=image_short_url)[0]
                        existing_images.append(image.id)

                product.images.exclude(id__in=existing_images).delete()

                 
                """ firebase """
                update_product(product)
            
                return Response({
                    'status': 'success',
                    'Message':'product is updated' ,
                    'data':{"product_uuid": product.uuid}
                    })
            else:
                return Response({
                    'status': 'failure',
                    'Message':'Product Open time is already started it cannot be updated || opentime is greater then closetime' ,
                    'data':{"product_uuid": product.uuid}
                    })
                
        except Exception as e:
            return Response({
                "status":"failure",
                "message": "Request cannot be proceeded- " + str(e),
                'data':{""}
                },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class CreateBids(viewsets.ModelViewSet):
    serializer_class = BidSerializer
    permission_classes = (IsAuthenticated,)
    
    def create(self,request):
        try:
            user=request.user
            uuid = request.data.get('product_uuid')
            price=int(request.data.get('price'))
            
            product=Product.objects.get(uuid=uuid)
            
            highest_bid=product.get_highest_bid
            if highest_bid==0:
                highest_bid=product.price
            
            if price > highest_bid:
                try:
                    user_bid=Bid.objects.get(product=product,user=user)
                    user_coins=user_bid.price+user.coins
                    if price <=user_coins:
                        user_bid.price=price
                        user_bid.save()
                        user.coins=user_coins-price
                        user.save()
                        update_highestBid(product)
                        return Response({
                            "status":"Success",
                            'Message':"Bid is created",
                            'data':{"currnet_user_coins": user.coins}})
                    else:
                        return Response({
                            "status":"failure",
                            'Message':"user does not have enough coins",
                            'data':{"user_coins": user_coins}})           
                        
                except:
                    if price <= user.coins:
                        bid=Bid.objects.create(user=user,product=product,price=price)
                        user.coins=user.coins-price
                        user.save()
                        """ firebase""" 
                        update_highestBid(product)
                        return Response({
                            "status":"Success",
                            'Message':"Bid is created",
                            'data':{"currnet_user_coins": user.coins}})
                    else:
                        return Response({
                            "status":"failure",
                            'Message':"user does not have enough coins",
                            'data':{"user_coins": user.coins}})    
                
            else:
                return Response({
                    "status":"failure",
                    'Message':"Current Bid is less then highest Bid",
                    'data':{"highest_bid": highest_bid}})
                
            
        except Exception as e:
            return Response({
                "status":"failure",
                "message": "Request cannot be proceeded- " + str(e),
                'data':{""}
                },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductOrder(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    
    def create(self,request):
        try:
            user=request.user
            products=request.data.get('products')
            total_price=0
            
            for product_data in products:
                product_uuid=product_data['uuid']
                quantity=product_data['quantity']
                product=Product.objects.get(uuid=product_uuid)
                
                if product.stock >= quantity:
                    total_price=total_price+product.price *quantity
                    
                else:
                    return Response({
                    "status":"failure",
                    "message": "product stock less then quantity " + str(product.title),
                    'data':{""}
                    })
                    
            if user.coins  >= total_price:
                user.coins=user.coins-total_price
                user.save()
                order=Order.objects.create(price=total_price,user=user)
                order.save()
                for product_data in products:
                    product_uuid=product_data['uuid']
                    quantity=product_data['quantity']
                
                    product=Product.objects.get(uuid=product_uuid)
                    product.stock=product.stock-quantity
                    if product.stock == 0:
                        product.status='out of stock'
                    product.save()
                    
                    OrderProduct.objects.create(product=product,order=order,quantity=quantity)
                    
                    """ firebase """
                    update_stock(product)
                
                return Response({
                "status":"success",
                "message": "Order  Is created" ,
                'data':{""}
                    })    
            else:
                return Response({
                "status":"failure",
                "message": "User don't have enough coins",
                'data':{""}
                })
        
        except Exception as e:
            return Response({
                "status":"failure",
                "message": "Request cannot be proceeded- " + str(e),
                'data':{""}
                },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

            