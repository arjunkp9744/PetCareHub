from django.db.models import Q
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
)
from rest_framework.exceptions import ValidationError

from .models import Category, Product, Cart, CartItem, OrderItem, Order, OrderStatus, Review, WishlistItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, OrderSerializer,ReviewSerializer, WishlistItemSerializer 

from django.db import transaction
from .pagination import ProductPagination

class CategoryListView(generics.ListAPIView):
    """
    Displays all active product categories.
    """

    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Category.objects.filter(
            is_active=True
        ).order_by("name")


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPagination

    def get_queryset(self):
        queryset = Product.objects.filter(
            is_available=True,
            stock__gt=0,
            category__is_active=True,
        )

        category_id = self.request.query_params.get("category")
        pet_type = self.request.query_params.get("pet_type")
        search = self.request.query_params.get("search")
        ordering = self.request.query_params.get("ordering")

        if category_id:
            queryset = queryset.filter(
                category_id=category_id
            )

        if pet_type:
            queryset = queryset.filter(
                pet_type__iexact=pet_type
            )

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(brand__icontains=search)
                | Q(description__icontains=search)
            )

        allowed_ordering = {
            "price_low": "price",
            "price_high": "-price",
            "newest": "-created_at",
            "oldest": "created_at",
            "name_az": "name",
            "name_za": "-name",
        }

        if ordering in allowed_ordering:
            queryset = queryset.order_by(
                allowed_ordering[ordering]
            )
        else:
            queryset = queryset.order_by("-created_at")

        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    """
    Returns the details of one available product.
    """

    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Product.objects.filter(
            is_available=True,
            category__is_active=True,
        )

class ProductReviewListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = ReviewSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):
        product_id = self.kwargs["product_id"]

        return Review.objects.filter(
            product_id=product_id
        ).select_related(
            "user",
            "product",
        ).order_by("-created_at")

    def perform_create(self, serializer):
        product_id = self.kwargs["product_id"]

        review_exists = Review.objects.filter(
            user=self.request.user,
            product_id=product_id,
        ).exists()

        if review_exists:
            raise ValidationError(
                {
                    "detail": (
                        "You have already reviewed "
                        "this product."
                    )
                }
            )

        serializer.save(
            user=self.request.user,
            product_id=product_id,
        )   

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(
            user=self.request.user
        )   

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(
            user=self.request.user
        ).select_related(
            "product",
            "product__category",
        ).order_by("-created_at")

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]

        wishlist_item_exists = WishlistItem.objects.filter(
            user=self.request.user,
            product=product,
        ).exists()

        if wishlist_item_exists:
            raise ValidationError(
                {
                    "detail": (
                        "This product is already "
                        "in your wishlist."
                    )
                }
            )

        serializer.save(
            user=self.request.user
        )     

class WishlistDeleteView(generics.DestroyAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(
            user=self.request.user
        )
    
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartSerializer(cart)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)

        if not product_id:
            return Response(
                {
                    "product": "Product ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {
                    "quantity": "Quantity must be a valid number."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {
                    "quantity": "Quantity must be at least 1."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product = Product.objects.get(
                id=product_id,
                is_available=True,
            )
        except Product.DoesNotExist:
            return Response(
                {
                    "product": "Product not found or unavailable."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": quantity,
            },
        )

        if not item_created:
            new_quantity = cart_item.quantity + quantity

            if new_quantity > product.stock:
                return Response(
                    {
                        "quantity": (
                            "Requested quantity exceeds available stock."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart_item.quantity = new_quantity
            cart_item.save()

        elif quantity > product.stock:
            cart_item.delete()

            return Response(
                {
                    "quantity": (
                        "Requested quantity exceeds available stock."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CartSerializer(cart)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )    

class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(
                id=pk,
                cart__user=request.user,
            )
        except CartItem.DoesNotExist:
            return Response(
                {
                    "detail": "Cart item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        quantity = request.data.get("quantity")

        if quantity is None:
            return Response(
                {
                    "quantity": "Quantity is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {
                    "quantity": "Quantity must be a valid number."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {
                    "quantity": "Quantity must be at least 1."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity > cart_item.product.stock:
            return Response(
                {
                    "quantity": (
                        "Requested quantity exceeds available stock."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart_item.cart)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(
                id=pk,
                cart__user=request.user,
            )
        except CartItem.DoesNotExist:
            return Response(
                {
                    "detail": "Cart item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = cart_item.cart
        cart_item.delete()

        serializer = CartSerializer(cart)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )   
class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        shipping_address = request.data.get(
            "shipping_address"
        )
        phone_number = request.data.get(
            "phone_number"
        )

        if not shipping_address:
            return Response(
                {
                    "shipping_address": (
                        "Shipping address is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not phone_number:
            return Response(
                {
                    "phone_number": (
                        "Phone number is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            cart = Cart.objects.get(
                user=request.user
            )
        except Cart.DoesNotExist:
            return Response(
                {
                    "detail": "Cart does not exist."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_items = cart.items.select_related(
            "product"
        )

        if not cart_items.exists():
            return Response(
                {
                    "detail": "Your cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_amount = 0

        for cart_item in cart_items:
            product = cart_item.product

            if not product.is_available:
                return Response(
                    {
                        "detail": (
                            f"{product.name} is unavailable."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if cart_item.quantity > product.stock:
                return Response(
                    {
                        "detail": (
                            f"Insufficient stock for "
                            f"{product.name}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            total_amount += (
                product.price * cart_item.quantity
            )

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            shipping_address=shipping_address,
            phone_number=phone_number,
        )

        for cart_item in cart_items:
            product = cart_item.product

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=cart_item.quantity,
                price=product.price,
            )

            product.stock -= cart_item.quantity

            if product.stock == 0:
                product.is_available = False

            product.save()

        cart_items.delete()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )   
class OrderListView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
            .order_by("-created_at")
        )


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
        )     

class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        try:
            order = Order.objects.prefetch_related(
                "items__product"
            ).get(
                id=pk,
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status in [
            OrderStatus.SHIPPED,
            OrderStatus.DELIVERED,
        ]:
            return Response(
                {
                    "detail": (
                        "This order cannot be cancelled."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.status == OrderStatus.CANCELLED:
            return Response(
                {
                    "detail": "Order is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        for item in order.items.all():
            product = item.product

            product.stock += item.quantity
            product.is_available = True
            product.save()

        order.status = OrderStatus.CANCELLED
        order.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )    

class AdminOrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not request.user.is_staff:
            return Response(
                {
                    "detail": "Admin access is required."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {
                    "status": "Order status is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_statuses = [
            choice[0]
            for choice in OrderStatus.choices
        ]

        if new_status not in valid_statuses:
            return Response(
                {
                    "status": "Invalid order status."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed_transitions = {
            OrderStatus.PENDING: [
                OrderStatus.PROCESSING,
                OrderStatus.CANCELLED,
            ],
            OrderStatus.PROCESSING: [
                OrderStatus.SHIPPED,
                OrderStatus.CANCELLED,
            ],
            OrderStatus.SHIPPED: [
                OrderStatus.DELIVERED,
            ],
            OrderStatus.DELIVERED: [],
            OrderStatus.CANCELLED: [],
        }

        if new_status not in allowed_transitions[
            order.status
        ]:
            return Response(
                {
                    "status": (
                        f"Cannot change status from "
                        f"{order.status} to {new_status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = new_status
        order.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )    