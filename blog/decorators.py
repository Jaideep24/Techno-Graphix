from functools import wraps
from django.core.cache import cache
from django.http import HttpResponseForbidden

def ratelimit(key='', rate='60/h'):
    """
    Rate limiting decorator.
    :param key: Key to use for rate limiting (e.g., 'ip', 'user')
    :param rate: Rate string (e.g., '100/h', '1000/d')
    """
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            # Get the identifier based on key type
            if key == 'ip':
                ident = request.META.get('REMOTE_ADDR')
            elif key == 'user' and request.user.is_authenticated:
                ident = request.user.id
            else:
                ident = request.META.get('REMOTE_ADDR')
            
            # Parse rate
            count, period = rate.split('/')
            count = int(count)
            multiplier = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}
            period_seconds = multiplier.get(period[0], 3600)
            
            # Generate cache key
            cache_key = f'ratelimit:{func.__name__}:{ident}'
            
            # Get current count
            current = cache.get(cache_key, 0)
            
            if current >= count:
                return HttpResponseForbidden('Rate limit exceeded')
            
            # Increment count
            cache.set(cache_key, current + 1, period_seconds)
            
            return func(request, *args, **kwargs)
        return wrapper
    return decorator
