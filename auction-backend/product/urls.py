from django import urls
from product.views import CRUDProduct, CreateBids, ProductOrder
from django.urls import path, include
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('create-product/', CRUDProduct.as_view({'post': 'create'})),
    path('remove-product/', CRUDProduct.as_view({'delete': 'remove'})),
    path('retrieve-product/', CRUDProduct.as_view({'get': 'retrieve'})),
    path('list-products/', CRUDProduct.as_view({'get': 'list'})),
    path('my-products/', CRUDProduct.as_view({'get': 'myProducts'})),
    path('update-product/', CRUDProduct.as_view({'post': 'update'})),
    path('create-bids/', CreateBids.as_view({'post': 'create'})),
    path('products-order/', ProductOrder.as_view({'post': 'create'})),
]
        