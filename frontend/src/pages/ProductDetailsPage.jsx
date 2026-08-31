import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheckCircle,
  FaShoppingCart,
  FaStar,
  FaTag,
} from "react-icons/fa";
import api from "../services/api";

import "./ProductDetailsPage.css";

function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api
      .get(`shop/products/${id}/`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Unable to fetch product:", error);
        setError("Unable to load product details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
        "Unable to add product:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Unable to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="product-page-state">
        <div className="loading-paw">🐾</div>
        <h4>Loading product details...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page-state">
        <h4 className="text-danger">{error}</h4>
        <Link to="/products" className="back-to-shop-link">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-state">
        <h4>Product not found.</h4>
        <Link to="/products" className="back-to-shop-link">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <main className="product-details-page">
      <div className="container py-5">
        <Link to="/products" className="back-to-shop-link">
          <FaArrowLeft /> Back to Shop
        </Link>

        <div className="product-details-card">
          <div className="row g-0">
            <div className="col-lg-6">
              <section className="details-image-section">
                <span
                  className={`details-stock-badge ${
                    isOutOfStock ? "out-of-stock" : ""
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>

                <img
                  src={product.image}
                  alt={product.name}
                  className="details-product-image"
                />
              </section>
            </div>

            <div className="col-lg-6">
              <section className="details-content">
                <div className="details-category">
                  <FaTag /> {product.category_name}
                </div>

                <h1>{product.name}</h1>

                <div className="details-rating">
                  <FaStar />
                  <strong>{product.average_rating || "0.0"}</strong>
                  <span>({product.review_count || 0} reviews)</span>
                </div>

                <div className="details-price">₹{product.price}</div>

                <div className="product-information">
                  <div className="information-item">
                    <span>Brand</span>
                    <strong>{product.brand}</strong>
                  </div>

                  <div className="information-item">
                    <span>For</span>
                    <strong>{product.pet_type}</strong>
                  </div>

                  <div className="information-item">
                    <span>Availability</span>
                    <strong
                      className={
                        isOutOfStock
                          ? "availability-out"
                          : "availability-in"
                      }
                    >
                      {isOutOfStock ? (
                        "Out of Stock"
                      ) : (
                        <>
                          <FaCheckCircle /> {product.stock} items available
                        </>
                      )}
                    </strong>
                  </div>
                </div>

                <div className="details-description">
                  <h5>About this product</h5>
                  <p>{product.description}</p>
                </div>

                <button
                  type="button"
                  className="details-add-cart-button"
                  onClick={handleAddToCart}
                  disabled={adding || isOutOfStock}
                >
                  <FaShoppingCart />
                  {adding
                    ? "Adding to Cart..."
                    : isOutOfStock
                      ? "Currently Unavailable"
                      : "Add to Cart"}
                </button>

                <Link to="/cart" className="go-to-cart-link">
                  <FaBoxOpen /> View My Cart
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;  