import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addOrder } from "../redux/slices/orderSlice";
import { auth } from "../firebase/firebase";

function CheckoutPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const userId = auth.currentUser?.uid;
  const [address, setAddress] = useState("");
  const [item, setItem] = useState(null);
  const [isCheckoutAll, setIsCheckoutAll] = useState(id === undefined);

  useEffect(() => {
    if (id) {
      const foundItem = items.find((item) => item.id === id);
      setItem(foundItem);
    } else {
      setIsCheckoutAll(true);
    }
  }, [id, items]);

  const handleCheckout = () => {
    if (userId) {
      const products = isCheckoutAll
        ? items
        : [{ ...item, quantity: item.quantity }];

      dispatch(
        addOrder({
          userId,
          products,
          address,
        })
      );
      navigate("/orders"); 
    } else {
      alert("User not logged in.");
    }
  };

  if (!isCheckoutAll && !item) {
    return <p>Item not found.</p>; 
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {isCheckoutAll ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Items</h2>
          {items.map((item) => (
            <div key={item.id} className="border p-4 mb-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p>${item.price} x {item.quantity}</p>
            </div>
          ))}
          <label className="block text-lg font-semibold mb-2" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
            rows="4"
          ></textarea>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Place Order
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{item?.title}</h2>
          <p>${item?.price}</p>
          <label className="block text-lg font-semibold mb-2" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
            rows="4"
          ></textarea>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
