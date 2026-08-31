import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
  e.preventDefault();

  setPlacingOrder(true);

  try {
    const response = await api.post("shop/checkout/", {
      shipping_address: shippingAddress,
      phone_number: phoneNumber,
    });

    console.log("Order created:", response.data);

    alert("Order placed successfully!");
    navigate("/orders");

  } catch (error) {
    console.error(
      "Checkout failed:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.detail ||
      "Unable to place order."
    );

  } finally {
    setPlacingOrder(false);
  }
};

 return (
  <div
    className="container mt-5"
    style={{ maxWidth: "600px" }}
  >
    <h2 className="mb-4">Checkout</h2>

    <form onSubmit={handleCheckout}>
      <div className="mb-3">
        <label className="form-label">
          Shipping Address
        </label>

        <textarea
          className="form-control"
          rows="4"
          value={shippingAddress}
          onChange={(e) =>
            setShippingAddress(e.target.value)
          }
          placeholder="Enter your complete shipping address"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Phone Number
        </label>

        <input
          type="tel"
          className="form-control"
          value={phoneNumber}
          onChange={(e) =>
            setPhoneNumber(e.target.value)
          }
          placeholder="Enter your phone number"
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-success w-100"
        disabled={placingOrder}
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  </div>
);
}

export default CheckoutPage;