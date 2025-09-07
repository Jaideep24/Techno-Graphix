from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/submit/', views.contact_submit, name='contact_submit'),
    path('portfolio/filter/<str:category>/', views.portfolio_filter, name='portfolio_filter'),
]