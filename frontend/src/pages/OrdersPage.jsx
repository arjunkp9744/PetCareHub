import { useEffect, useState } from "react";
import api from "../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const cancelOrder = async (orderId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await api.post(
      `shop/orders/${orderId}/cancel/`
    );

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? response.data
          : order
      )
    );

    alert("Order cancelled successfully!");
  } catch (error) {
    console.error(
      "Unable to cancel order:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.detail ||
      "Unable to cancel order."
    );
  }
};

  useEffect(() => {
    api
      .get("shop/orders/")
      .then((response) => {
        console.log("Orders response:", response.data);

        const orderData =
          response.data.results || response.data;

        setOrders(orderData);
      })
      .catch((error) => {
        console.error(
          "Unable to load orders:",
          error.response?.data || error.message
        );

        setError("Unable to load your orders.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <h3>Loading orders...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h3 className="text-danger">{error}</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>

{orders.length === 0 ? (
  <div className="alert alert-info">
    You have no orders yet.
  </div>
) : (
  orders.map((order) => (
    <div
      className="card shadow-sm mb-4"
      key={order.id}
    >
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">
              Order #{order.id}
            </h5>

            <small className="text-muted">
              {new Date(order.created_at).toLocaleString()}
            </small>
          </div>

          <span className="badge bg-warning text-dark">
            {order.status}
          </span>
        </div>

        <hr />

        {order.items.map((item) => (
          <div
            key={item.id}
            className="mb-3"
          >
            <h6>{item.product_name}</h6>

            <p className="mb-1">
              Price: ₹{item.price}
            </p>

            <p className="mb-1">
              Quantity: {item.quantity}
            </p>

            <p className="mb-1">
              Subtotal: ₹
              {Number(item.price) * item.quantity}
            </p>
          </div>
        ))}

        <hr />

        <p>
          <strong>Shipping Address:</strong>{" "}
          {order.shipping_address}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {order.phone_number}
        </p>

        <h5 className="text-end">
          Total: ₹{order.total_amount}
        </h5>

        {order.status !== "CANCELLED" &&
          order.status !== "SHIPPED" &&
          order.status !== "DELIVERED" && (
            <button
              type="button"
              className="btn btn-outline-danger mt-2"
              onClick={() => cancelOrder(order.id)}
            >
              Cancel Order
            </button>
          )}

      </div>
    </div>
  ))
)}    </div>
  );
}

export default OrdersPage;