from django.db import models
from django.utils.text import slugify

class Service(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=200)
    icon = models.CharField(max_length=50, help_text="CSS class for icon")
    features = models.TextField(help_text="One feature per line")
    starting_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
    highlight = models.BooleanField(default=False, help_text="Show this service prominently in the hero section")
    cta_text = models.CharField(max_length=50, blank=True, help_text="Call to action button text")
    cta_link = models.CharField(max_length=200, blank=True, help_text="Call to action button link")
    background_color = models.CharField(max_length=20, blank=True, help_text="CSS color value for service card")

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_features_list(self):
        return [feature.strip() for feature in self.features.split('
') if feature.strip()]