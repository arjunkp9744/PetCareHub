import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaPaw,
} from "react-icons/fa";

import api from "../services/api";
import "./CartPage.css";

const MEDIA_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api/", "")
  : "http://127.0.0.1:8000";

function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("shop/cart/");

      setCart(response.data);
    } catch (error) {
      console.error(
        "Unable to load cart:",
        error.response?.data || error.message
      );

      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    item,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdating(item.id);

      const response = await api.patch(
       `shop/cart/items/${item.id}/`,
        {
          quantity: newQuantity,
        }
      );

      setCart(response.data);
    } catch (error) {
      console.error(
        "Unable to update quantity:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.quantity ||
        error.response?.data?.detail ||
        "Unable to update quantity.";

      alert(message);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (item) => {
    const confirmed = window.confirm(
      `Remove ${item.product_name} from your cart?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdating(item.id);

      const response = await api.delete(
        `shop/cart/items/${item.id}/remove/`
      );

      setCart(response.data);
    } catch (error) {
      console.error(
        "Unable to remove cart item:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Unable to remove item."
      );
    } finally {
      setUpdating(null);
    }
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-loading">
            <div className="cart-loading-icon">
              🛒
            </div>

            <h3>
              Loading your cart...
            </h3>

            <p>
              Getting your products ready.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-error">
            <div>😿</div>

            <h3>{error}</h3>

            <button
              type="button"
              onClick={loadCart}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="cart-page">
      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="cart-header">

          <div>
            <span>
              PETCARE HUB SHOP
            </span>

            <h1>
              Your Shopping Cart
            </h1>

            <p>
              Review your products before
              checking out.
            </p>
          </div>

          <div className="cart-header-icon">
            <FaShoppingCart />
          </div>

        </div>

        {/* ================= EMPTY ================= */}

        {isEmpty ? (

          <div className="cart-empty">

            <div className="cart-empty-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
            >
              <FaPaw />
              Continue Shopping
            </button>

          </div>

        ) : (

          <div className="cart-layout">

            {/* ================= ITEMS ================= */}

            <section className="cart-items-section">

              <div className="cart-items-header">

                <h2>
                  Cart Items
                </h2>

                <span>
                  {cart.total_items}{" "}
                  {cart.total_items === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              <div className="cart-items">

                {items.map((item) => (

                  <article
                    className="cart-item"
                    key={item.id}
                  >

                    {/* IMAGE */}

                    <div className="cart-product-image">
                      {item.product_image ? (
                        <img
                          src={
                                item.product_image?.startsWith("http")
                                  ? item.product_image
                                  : `${MEDIA_URL}${item.product_image}`
                              }
                          alt={item.product_name}
                        />
                      ) : (
                        <FaPaw />
                      )}
                    </div>

                    {/* PRODUCT */}

                    <div className="cart-product-info">

                      <h3>
                        {item.product_name}
                      </h3>

                      <p>
                        ₹
                        {formatPrice(
                          item.product_price
                        )}{" "}
                        each
                      </p>

                    </div>

                    {/* QUANTITY */}

                    <div className="cart-quantity">

                      <button
                        type="button"
                        disabled={
                          updating ===
                            item.id ||
                          item.quantity <= 1
                        }
                        onClick={() =>
                          updateQuantity(
                            item,
                            item.quantity - 1
                          )
                        }
                      >
                        <FaMinus />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={
                          updating ===
                          item.id
                        }
                        onClick={() =>
                          updateQuantity(
                            item,
                            item.quantity + 1
                          )
                        }
                      >
                        <FaPlus />
                      </button>

                    </div>

                    {/* SUBTOTAL */}

                    <div className="cart-item-price">

                      <strong>
                        ₹
                        {formatPrice(
                          item.subtotal
                        )}
                      </strong>

                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      className="cart-remove"
                      disabled={
                        updating === item.id
                      }
                      onClick={() =>
                        removeItem(item)
                      }
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>

                  </article>

                ))}

              </div>

              <button
                type="button"
                className="continue-shopping"
                onClick={() =>
                  navigate("/products")
                }
              >
                <FaArrowLeft />
                Continue Shopping
              </button>

            </section>

            {/* ================= SUMMARY ================= */}

            <aside className="cart-summary">

              <div className="summary-top">

                <span>
                  ORDER SUMMARY
                </span>

                <h2>
                  Summary
                </h2>

              </div>

              <div className="summary-row">

                <span>
                  Items
                </span>

                <strong>
                  {cart.total_items}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {formatPrice(
                    cart.total_price
                  )}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Delivery
                </span>

                <strong className="free">
                  FREE
                </strong>

              </div>

              <div className="summary-divider" />

              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {formatPrice(
                    cart.total_price
                  )}
                </strong>

              </div>

              <button
                type="button"
                className="checkout-button"
                onClick={() =>
                  navigate("/checkout")
                }
              >
                Proceed to Checkout
                <FaArrowRight />
              </button>

              <div className="secure-checkout">
                🔒 Secure checkout
              </div>

            </aside>

          </div>

        )}

      </div>
    </div>
  );
}

export default CartPage;