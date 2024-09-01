import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productsSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";

function ProductListPage() {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = (product) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      dispatch(addToCart({ userId, productId: product.id, quantity: 1 }));
      alert("Item added to the cart.");
    } else {
      alert("Please log in to add items to the cart.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading")
    return <p className="text-center text-lg">Loading...</p>;
  if (status === "failed")
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Product List</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 p-2 rounded-md w-full md:w-1/2 lg:w-1/3"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-lg flex flex-col"
          >
            <Link to={`/product/${product.id}`} className="block text-blue-300">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-2">${product.price}</p>
              </div>
            </Link>
            <div className="p-4 mt-auto">
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mb-2"
              >
                Add to Cart
              </button>
              <Link
                to={`/product/${product.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full text-center block"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;
