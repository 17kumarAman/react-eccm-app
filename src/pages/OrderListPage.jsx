import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByUserId } from "../redux/slices/orderSlice";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function OrderListPage() {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByUserId(userId));
    } else {
      alert("please login first");
      navigate("/");
    }
  }, [userId, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Order List</h1>
      {orders.length === 0 && <p>No orders found.</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Order ID: {order.id}</h2>
            <p className="mb-2">
              Date: {new Date(order.date.seconds * 1000).toLocaleDateString()}
            </p>
            <p className="mb-2">Address: {order.address}</p>
            <h3 className="text-lg font-semibold mb-2">Products:</h3>
            <ul className="list-disc pl-5">
              {order.products.map((product) => (
                <li key={product.id}>
                  {product.title} - Quantity: {product.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderListPage;
