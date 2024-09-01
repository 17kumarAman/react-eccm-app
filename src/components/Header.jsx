import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, signOutUser } from "../firebase/firebase";

function Header() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignIn = () => {
    signInWithGoogle().catch((error) => alert(error.message));
  };

  const handleSignOut = () => {
    signOutUser().catch((error) => alert(error.message));
  };

  return (
    <header className="bg-blue-600 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">
          <span>Welcome, {user?.displayName || "User"}</span>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 transition duration-300"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className="hover:text-gray-300 transition duration-300"
            >
              Cart
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="hover:text-gray-300 transition duration-300"
            >
              Orders
            </Link>
          </li>
          {user ? (
            <li>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={handleSignIn}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Login
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
