import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const fetchProductDetails = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnapshot = await getDoc(productRef);
    if (productSnapshot.exists()) {
      return { id: productSnapshot.id, ...productSnapshot.data() };
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    throw new Error("Error fetching product details: " + error.message);
  }
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity = 1 }) => {
    try {
      const cartRef = collection(db, "userCart");
      const q = query(
        cartRef,
        where("userId", "==", userId),
        where("productId", "==", productId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const existingData = querySnapshot.docs[0].data();
        const newQuantity = existingData.quantity + quantity;

        const docRef = doc(db, "userCart", docId);
        await updateDoc(docRef, { quantity: newQuantity });

        return { userId, productId, quantity: newQuantity };
      } else {
        await addDoc(cartRef, { userId, productId, quantity });
        return { userId, productId, quantity };
      }
    } catch (error) {
      throw new Error("Error adding to cart: " + error.message);
    }
  }
);

export const fetchCartByUserId = createAsyncThunk(
  "cart/fetchCartByUserId",
  async (userId) => {
    try {
      const cartRef = collection(db, "userCart");
      const q = query(cartRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const cartItems = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const cartItem = doc.data();
          const productDetails = await fetchProductDetails(cartItem.productId);
          delete productDetails.id;

          console.log({ id: doc.id, ...cartItem, ...productDetails });
          return { id: doc.id, ...cartItem, ...productDetails };
        })
      );

      return cartItems;
    } catch (error) {
      throw new Error("Error fetching cart: " + error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }) => {
    try {
      const cartItemRef = doc(db, "userCart", id);
      const cartItemSnapshot = await getDoc(cartItemRef);

      if (!cartItemSnapshot.exists()) {
        throw new Error("Document to update does not exist");
      }

      const currentData = cartItemSnapshot.data();
      const newQuantity = quantity;

      if (newQuantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      await updateDoc(cartItemRef, { quantity: newQuantity });

      return { id, quantity: newQuantity };
    } catch (error) {
      throw new Error("Error updating cart item: " + error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (id) => {
    try {
      const itemRef = doc(db, "userCart", id);
      const itemSnap = await getDoc(itemRef);

      if (itemSnap.exists()) {
        const itemData = itemSnap.data();
        console.log("Item data before removal:", itemData);
      } else {
        console.log("No such document!");
      }

      await deleteDoc(itemRef);
      console.log("Removed successfully:", id);

      return id;
    } catch (error) {
      throw new Error("Error removing cart item: " + error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCartByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCartByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index].quantity = action.payload.quantity;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
