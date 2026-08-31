from rest_framework import serializers

from .models import Category, Product, Cart, CartItem, Order, OrderItem, Review, WishlistItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "description",
            "is_active",
        )


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "description",
            "price",
            "stock",
            "brand",
            "pet_type",
            "image",
            "is_available",
            "average_rating",
            "review_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = (
                    "id",
                    "created_at",
                    "updated_at",
                )

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()

        if not reviews.exists():
            return 0

        total_rating = sum(
            review.rating for review in reviews
        )

        return round(
            total_rating / reviews.count(),
            1,
        )

    def get_review_count(self, obj):
        return obj.reviews.count()

       

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "user_name",
            "product",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "product",
            "created_at",
            "updated_at",
        ]

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(
        read_only=True
    )

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(
            is_available=True,
            stock__gt=0,
        ),
        source="product",
        write_only=True,
    )

    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product",
            "product_id",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]        

class CartItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    product_image = serializers.ImageField(
        source="product.image",
        read_only=True,
    )

    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem

        fields = (
            "id",
            "product",
            "product_name",
            "product_image",
            "product_price",
            "quantity",
            "subtotal",
        )

        read_only_fields = (
            "id",
            "subtotal",
        )

    def get_subtotal(self, obj):
        return obj.product.price * obj.quantity

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(
        many=True,
        read_only=True,
    )

    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart

        fields = (
            "id",
            "user",
            "items",
            "total_items",
            "total_price",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "user",
            "items",
            "total_items",
            "total_price",
            "created_at",
            "updated_at",
        )

    def get_total_items(self, obj):
        return sum(
            item.quantity
            for item in obj.items.all()
        )

    def get_total_price(self, obj):
        return sum(
            item.product.price * item.quantity
            for item in obj.items.all()
        )        
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "price",
        ]    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "total_amount",
            "shipping_address",
            "phone_number",
            "items",
            "created_at",
        ]        