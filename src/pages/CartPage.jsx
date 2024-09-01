import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartByUserId,
  updateCartItem,
  removeCartItem,
} from "../redux/slices/cartSlice";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.cart);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      // alert("Please log in first");
      // navigate("/");
      return;
    }
    dispatch(fetchCartByUserId(userId));
    console.log(items)
  }, [userId, dispatch, navigate]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 1) {
      dispatch(updateCartItem({ id, quantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeCartItem(id));
  };

  const handleCheckout = (id) => {
    navigate(`/checkout/${id}`); 
  };
  const handleCheckoutAll = (id) => {
    navigate(`/checkout`);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >{console.log(item)}
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p>${item.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleCheckout(item.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Price Summary</h2>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button
                    onClick={() => handleCheckoutAll(items)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Checkout
                  </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
