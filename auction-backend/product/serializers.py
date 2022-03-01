
from users.models import User
from rest_framework import serializers
from product.models import Bid, Image, Product, Tag



class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag"""

    class Meta:
        model = Tag
        fields = ['name']
        
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['is_featured', 'image']

class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = '__all__'
        
class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product"""
    images = ImageSerializer(many=True)

    seller = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='uuid'
     )
    tags = serializers.SlugRelatedField(
        queryset=Tag.objects.all(),
        slug_field='title', 
        many=True
     )

    class Meta:
        model = Product
        fields = [ 'seller','uuid','tags' , 'title' , 'detail' , 'price', 'close_time', 'open_time', 'link_video','images','status','type','stock','get_highest_bid']
        
    

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

    
    
    
    
   
    