from config.settings import BASE_DIR
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from django.conf import settings

# Fetch the service account key JSON file contents
cred = credentials.Certificate(str(settings.BASE_DIR)+"/product/firebase-adminsdk.json")
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://auction-demo-7fb8a-default-rtdb.firebaseio.com"
})

ref = db.reference('/products')

def add_product(product):
    images=list(product.images.all().values_list('image','is_featured'))
    imagesdata=[]
    for data in images:
        imagesdata.append({
            "image": "media/"+str(data[0]),
            "is_featured": data[1]
        })

    new_box = ref.push({ 
                        "title": product.title,
                        "detail":product.detail,
                        "price": product.price,
                        "tags": list(product.tags.all().values_list('title',flat=True)),
                        "close_time": product.close_time,
                        "open_time": product.open_time,
                        "link_video": product.link_video,
                        "status": product.status,
                        "type": product.type,
                        "stock": product.stock,
                        "images": imagesdata,
                        "product_uuid":str(product.uuid),
                        "get_highest_bid": product.price
                                  
                     })
    box_id = new_box.key
    product.firebasekey=box_id
    product.save()

def update_product(product):
    ref = db.reference('/products')
    
    images=list(product.images.all().values_list('image','is_featured'))
    imagesdata=[]
    for data in images:
        imagesdata.append({
            "image": "media/"+str(data[0]),
            "is_featured": data[1]
        })
        
    box_ref = ref.child(product.firebasekey)
    box_ref.update({
                        "title": product.title,
                        "detail":product.detail,
                        "price": product.price,
                        "tags": list(product.tags.all().values_list('title',flat=True)),
                        "close_time": str(product.close_time),
                        "open_time": str(product.open_time),
                        "link_video": product.link_video,
                        "status": product.status,
                        "type": product.type,
                        "stock": product.stock,
                        "images": imagesdata,
                        "product_uuid": str(product.uuid)
                    })
    
def update_status(product):
    ref = db.reference('/products')
    
    box_ref = ref.child(product.firebasekey)
    box_ref.update({
                     
                        "status": product.status
                    
                    
                    })
    
def update_stock(product):
    ref = db.reference('/products')
    
    box_ref = ref.child(product.firebasekey)
    box_ref.update({
                     
                        "stock": product.stock
                    
                    })
    
def update_highestBid(product):
    ref = db.reference('/products')
    
    box_ref = ref.child(product.firebasekey)
    box_ref.update({
                     
                         "get_highest_bid": product.get_highest_bid
                    
                    })
    
def delete_product(product):
    ref = db.reference('/products')
    
    box_ref = ref.child(product.firebasekey)
    box_ref.delete()

    
    
    
    