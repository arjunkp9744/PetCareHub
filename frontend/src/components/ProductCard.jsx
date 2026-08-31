import { useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaEye,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../services/api";

import "./ProductCard.css";

function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    setAdding(true);

    try {
      await api.post("shop/cart/add/", {
        product_id: product.id,
        quantity: 1,
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          "Failed to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  const handleAddToWishlist = async () => {
    setAddingToWishlist(true);

    try {
      await api.post("shop/wishlist/", {
        product_id: product.id,
      });

      alert("Product added to wishlist!");
    } catch (error) {
      console.error(
        "Failed to add to wishlist:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Product may already be in your wishlist."
      );
    } finally {
      setAddingToWishlist(false);
    }
  };

  return (
    <Card className="product-card h-100 border-0">
      <div className="product-image-wrapper">
        <Badge
          bg={isOutOfStock ? "danger" : "success"}
          className="stock-badge"
        >
          {isOutOfStock ? "Out of stock" : "In stock"}
        </Badge>

        <Button
          className="wishlist-icon-button"
          onClick={handleAddToWishlist}
          disabled={addingToWishlist}
          aria-label="Add product to wishlist"
        >
          <FaHeart />
        </Button>

        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>

      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="product-category">
            {product.category_name}
          </span>

          <div className="product-rating">
            {product.average_rating ? <FaStar /> : <FaRegStar />}
            <span>{product.average_rating || "0.0"}</span>
            <small>({product.review_count || 0})</small>
          </div>
        </div>

        <Card.Title className="product-title">
          {product.name}
        </Card.Title>

        <p className="product-meta">
          {product.brand} <span>•</span> {product.pet_type}
        </p>

        <Card.Text className="product-description">
          {product.description}
        </Card.Text>

        <div className="product-footer mt-auto">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
              <small className="stock-text">
                {isOutOfStock
                  ? "Currently unavailable"
                  : `${product.stock} items available`}
              </small>

              <h4 className="product-price mb-0">
                ₹{product.price}
              </h4>
            </div>
          </div>

          <Button
            className="add-cart-button w-100 mb-2"
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
          >
            <FaShoppingCart className="me-2" />
            {adding
              ? "Adding..."
              : isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
          </Button>

          <Link
            to={`/products/${product.id}`}
            className="view-details-button w-100"
          >
            <FaEye className="me-2" />
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;