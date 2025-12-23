from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Like


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_featured', 'is_active']
    list_filter = ['category', 'is_featured', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    list_editable = ['is_featured', 'is_active', 'price', 'stock']


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'total_price']
    inlines = [CartItemInline]


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'created_at']