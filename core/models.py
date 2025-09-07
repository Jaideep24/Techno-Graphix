from django.db import models
from django.core.validators import EmailValidator
from django.utils.text import slugify

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=1000, help_text="SVG icon markup")

    def __str__(self):
        return self.title

class Portfolio(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    slug = models.SlugField(unique=True, blank=True)
    category = models.CharField(max_length=50, choices=[
        ('web', 'Web'),
        ('apps', 'Apps'),
        ('design', 'Design'),
        ('video', 'Video'),
    ])
    image = models.ImageField(upload_to='portfolio/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Portfolio Items'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='team/')
    skills = models.CharField(max_length=200, help_text="Comma-separated list")
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    dribbble = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name

    def get_skills(self):
        return [skill.strip() for skill in self.skills.split(',') if skill.strip()]

class Stats(models.Model):
    projects_delivered = models.PositiveIntegerField(default=120)
    client_satisfaction = models.PositiveIntegerField(default=98)
    years_experience = models.PositiveIntegerField(default=8)

    class Meta:
        verbose_name_plural = 'Stats'

    def __str__(self):
        return "Site Statistics"

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='testimonials/')
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.company}"

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    excerpt = models.TextField()
    category = models.CharField(max_length=50)
    date = models.DateField()
    image = models.ImageField(upload_to='blog/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-date', 'order']

    def __str__(self):
        return self.title

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(validators=[EmailValidator()])
    service = models.CharField(max_length=50, choices=[
        ('web', 'Web Development'),
        ('app', 'App Development'),
        ('design', 'Graphic Design'),
        ('branding', 'Brand Identity'),
        ('marketing', 'Digital Marketing'),
    ])
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.service}"
