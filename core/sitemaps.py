from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from blog.models import Article


class StaticViewSitemap(Sitemap):
    """Sitemap for static / non-model pages."""
    priority = 1.0
    changefreq = "weekly"
    protocol = "https"

    def items(self):
        return ["home", "blog_list"]

    def location(self, item):
        if item == "home":
            return reverse("core:home")
        if item == "blog_list":
            return reverse("blog:blogspace")

    def priority(self, item):
        if item == "home":
            return 1.0
        return 0.8


class ArticleSitemap(Sitemap):
    """Sitemap for all published blog articles."""
    changefreq = "monthly"
    priority = 0.7
    protocol = "https"

    def items(self):
        return Article.objects.all().order_by("-date")

    def lastmod(self, obj):
        return obj.date

    def location(self, obj):
        return reverse("blog:detail_blog", kwargs={"pk": obj.pk})
