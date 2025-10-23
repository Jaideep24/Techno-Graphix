from django import forms
from .models import *



class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'content','image']
        widgets = {
            'title': forms.TextInput(attrs={'id': 'blogTitleInput'}),
            'content': forms.HiddenInput(),
        }
class CommentForm(forms.ModelForm):
    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'required': 'true','style': 'max-width: 100%; width: auto;'}))
    comment = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control','style': 'max-width: 100%; width: auto;'}))
    def __init__(self,*args,**kwargs):
        super(CommentForm,self).__init__(*args,**kwargs)
        self.fields['name'].widget.attrs['required']=True
    class Meta:
        model=Comment
        fields=['name','comment','article']
        widgets={'article':forms.HiddenInput}