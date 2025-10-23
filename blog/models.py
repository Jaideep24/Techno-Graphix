from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.utils import timezone
from multiselectfield import MultiSelectField
from phonenumber_field.modelfields import PhoneNumberField
from tinymce.models import HTMLField

class subscriber(models.Model):
    email=models.EmailField()
    def __str__(self):
        return self.email

class Article(models.Model):
    title = models.CharField(max_length=255)
    content = HTMLField()
    date = models.DateField()
    image=models.ImageField( default="default-ui-image-placeholder-wireframes-600nw-1037719192 (1).png")
    likes=models.IntegerField(blank=True, null=True, default=0)

    def __str__(self):
        return self.title
class Comment(models.Model):
    name=models.TextField(blank=False,default=" ")
    comment=models.TextField()
    date=models.DateField(auto_now_add=True)
    article=models.ForeignKey(Article,on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class Logger(models.Model):
    user_name=models.CharField(max_length=25)
    password=models.CharField(max_length=100)
