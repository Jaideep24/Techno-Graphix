from django.urls import path
from blog.views import *

app_name = 'blog'

urlpatterns = [
    path('blogspace/',Blogspace.as_view(),name='blogspace'),
    path('blogspace/<int:pk>/', DetailArticleView.as_view(), name='detail_blog'),
    path('blogspace/<int:pk>/delete', DeleteArticleView.as_view(), name='delete_article'),
    path('blogspace/<int:pk>/update',UpdateBlogView.as_view(),name='updateview'),
    path('create/', CreateBlogView.as_view(), name='create_blog'),
    path('edit/', view, name='login'),
]