from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
import json
from .models import Post, Category, Comment

from django.core.paginator import Paginator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.db.models import F

@cache_page(60 * 15)  # Cache for 15 minutes
def blog_index(request):
    search_query = request.GET.get('search', '')
    category_slug = request.GET.get('category', '')
    page = request.GET.get('page', 1)
    
    # Get posts from cache or database
    cache_key = f'blog_posts_{search_query}_{category_slug}_{page}'
    posts = cache.get(cache_key)
    
    if posts is None:
        posts = Post.objects.filter(published=True)
        
        if search_query:
            posts = posts.filter(
                Q(title__icontains=search_query) | 
                Q(content__icontains=search_query) |
                Q(excerpt__icontains=search_query)
            )
        
        if category_slug:
            posts = posts.filter(category__slug=category_slug)
        
        # Cache the queryset
        cache.set(cache_key, posts, 60 * 15)
    
    # Paginate results
    paginator = Paginator(posts, 10)  # 10 posts per page
    page_obj = paginator.get_page(page)
    
    # Get categories from cache or database
    categories = cache.get('blog_categories')
    if categories is None:
        categories = Category.objects.all()
        cache.set('blog_categories', categories, 60 * 60)  # Cache for 1 hour
    
    # Get featured posts from cache or database
    featured_posts = cache.get('featured_posts')
    if featured_posts is None:
        featured_posts = Post.objects.filter(published=True, featured=True)[:3]
        cache.set('featured_posts', featured_posts, 60 * 30)  # Cache for 30 minutes
    
    context = {
        'posts': posts,
        'categories': categories,
        'featured_posts': featured_posts,
        'search_query': search_query,
        'current_category': category_slug,
    }
    return render(request, 'blog/index.html', context)

@cache_page(60 * 5)  # Cache for 5 minutes
def blog_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, published=True)
    
    # Atomic increment of views
    Post.objects.filter(id=post.id).update(views=F('views') + 1)
    
    # Get comments from cache or database
    cache_key = f'post_comments_{post.id}'
    comments = cache.get(cache_key)
    if comments is None:
        comments = Comment.objects.filter(post=post, approved=True)
        cache.set(cache_key, comments, 60 * 5)  # Cache for 5 minutes
    
    # Get related posts from cache or database
    cache_key = f'related_posts_{post.id}'
    related_posts = cache.get(cache_key)
    if related_posts is None:
        related_posts = Post.objects.filter(
            category=post.category, 
            published=True
        ).exclude(id=post.id)[:3]
        cache.set(cache_key, related_posts, 60 * 30)  # Cache for 30 minutes
    
    context = {
        'post': post,
        'comments': comments,
        'related_posts': related_posts,
    }
    return render(request, 'blog/detail.html', context)

@csrf_exempt
@require_http_methods(["POST"])
def add_comment(request, slug):
    try:
        post = get_object_or_404(Post, slug=slug, published=True)
        data = json.loads(request.body)
        
        comment = Comment.objects.create(
            post=post,
            name=data.get('name'),
            email=data.get('email'),
            content=data.get('content')
        )
        
        return JsonResponse({
            'success': True, 
            'message': 'Comment submitted! It will appear after approval.'
        })
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'message': 'Failed to submit comment. Please try again.'
        })

@csrf_exempt
@require_http_methods(["POST"])
def like_post(request, slug):
    try:
        post = get_object_or_404(Post, slug=slug, published=True)
        post.likes += 1
        post.save()
        return JsonResponse({'success': True, 'likes': post.likes})
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to like post.'})