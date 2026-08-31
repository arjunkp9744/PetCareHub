import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get(
        "shop/wishlist/"
      );

      const wishlistData =
        response.data.results || response.data;

      setWishlist(wishlistData);

    } catch (error) {
      console.error(
        "Unable to load wishlist:",
        error.response?.data || error.message
      );

      setError(
        "Unable to load your wishlist."
      );

    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await api.delete(
        `shop/wishlist/${wishlistId}/`
      );

      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (item) => item.id !== wishlistId
        )
      );

    } catch (error) {
      console.error(
        "Unable to remove wishlist item:",
        error.response?.data || error.message
      );

      alert(
        "Unable to remove item from wishlist."
      );
    }
  };

  const handleAddToCart = async (productId) => {
  setAddingToCart(productId);

  try {
    const response = await api.post(
      "shop/cart/add/",
      {
        product_id: productId,
        quantity: 1,
      }
    );

    console.log(
      "Added to cart:",
      response.data
    );

    alert("Product added to cart!");

  } catch (error) {
    console.error(
      "Unable to add to cart:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.quantity ||
      error.response?.data?.product ||
      "Unable to add product to cart."
    );

  } finally {
    setAddingToCart(null);
  }
};

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading wishlist...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Wishlist ❤️</h2>

        <Link
          to="/products"
          className="btn btn-outline-success"
        >
          Continue Shopping
        </Link>
      </div>

      {wishlist.length === 0 ? (

        <div className="text-center py-5">

          <h4>
            Your wishlist is empty ❤️
          </h4>

          <p className="text-muted">
            Save products that you want to
            purchase later.
          </p>

          <Link
            to="/products"
            className="btn btn-success"
          >
            Browse Products
          </Link>

        </div>

      ) : (

        <div className="row g-4">

          {wishlist.map((item) => {

            const product = item.product;

            return (
              <div
                className="col-md-6 col-lg-4"
                key={item.id}
              >

                <div className="card h-100 shadow-sm">

                  {product.image && (
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">

                    <h5 className="card-title">
                      {product.name}
                    </h5>

                    <h6 className="text-success mb-3">
                      ₹{product.price}
                    </h6>

                    <div className="d-flex gap-2 flex-wrap">

                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-outline-primary"
                      >
                        View Product
                      </Link>

                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleAddToCart(product.id)
                        }
                        disabled={addingToCart === product.id}
                      >
                        {addingToCart === product.id
                          ? "Adding..."
                          : "Add to Cart"}
                      </button>

                      <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                          removeFromWishlist(item.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default WishlistPage;