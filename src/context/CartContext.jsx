import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase";

const CartContext = createContext();

function getProductId(product) {
  return (
    product.id ??
    product.productId ??
    product.page ??
    product.title ??
    product.name
  );
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [discountClaimed, setDiscountClaimed] = useState(false);
  const [discountAvailable, setDiscountAvailable] = useState(false);
  const [discountUsed, setDiscountUsed] = useState(false);
  const [discountLoading, setDiscountLoading] = useState(true);

  // Firebase discount status
  const refreshDiscountStatus = useCallback(async () => {
    const user = auth.currentUser;

    if (!user) {
      setDiscountClaimed(false);
      setDiscountAvailable(false);
      setDiscountUsed(false);
      setIsDiscountApplied(false);
      setDiscountLoading(false);
      return;
    }

    setDiscountLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        const claimed = userData.discountClaimed === true;
        const used = userData.discountUsed === true;
        const eligible = userData.eligible === true;

        setDiscountClaimed(claimed);
        setDiscountUsed(used);
        setDiscountAvailable(eligible && !used);

        if (used || !eligible) {
          setIsDiscountApplied(false);
        }
      } else {
        setDiscountClaimed(false);
        setDiscountAvailable(false);
        setDiscountUsed(false);
        setIsDiscountApplied(false);
      }
    } catch (error) {
      console.error("Discount status error:", error);
    } finally {
      setDiscountLoading(false);
    }
  }, []);

  // Login/logout listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsDiscountApplied(false);

      if (!user) {
        setDiscountClaimed(false);
        setDiscountAvailable(false);
        setDiscountUsed(false);
        setDiscountLoading(false);
        return;
      }

      refreshDiscountStatus();
    });

    return () => unsubscribe();
  }, [refreshDiscountStatus]);

  // Add product with selected size and selected price
  function addToCart(product, selectedSize, selectedPrice) {
    const productId = getProductId(product);

    const cartProduct = {
      ...product,
      size: selectedSize ?? product.size,
      price: Number(selectedPrice ?? product.price ?? 0),
      quantity: product.quantity || 1,
    };

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) =>
          getProductId(item) === productId && item.size === cartProduct.size,
      );

      if (existingItem) {
        return previousItems.map((item) => {
          if (
            getProductId(item) === productId &&
            item.size === cartProduct.size
          ) {
            return {
              ...item,
              quantity: (item.quantity || 1) + 1,
            };
          }

          return item;
        });
      }

      return [...previousItems, cartProduct];
    });
  }

  // Remove product
  function removeFromCart(productId, size) {
    setCartItems((previousItems) =>
      previousItems.filter((item) => {
        const matchesId = getProductId(item) === productId;
        const matchesSize = size === undefined || item.size === size;

        return !(matchesId && matchesSize);
      }),
    );
  }

  // Update quantity
  function updateQuantity(productId, size, newQuantity) {
    if (newQuantity < 1) return;

    setCartItems((previousItems) =>
      previousItems.map((item) => {
        const matches =
          getProductId(item) === productId &&
          (size === undefined || item.size === size);

        return matches ? { ...item, quantity: newQuantity } : item;
      }),
    );
  }

  // Clear cart
  function clearCart() {
    setCartItems([]);
    setIsDiscountApplied(false);
  }

  // Apply discount
  function applyDiscount() {
    if (discountAvailable && !discountUsed) {
      setIsDiscountApplied(true);
    }
  }

  // Remove discount
  function removeDiscount() {
    setIsDiscountApplied(false);
  }

  // Mark discount used after successful order
  async function markDiscountUsed() {
    if (!isDiscountApplied) {
      return true;
    }

    const user = auth.currentUser;

    if (!user) {
      throw new Error("User login required to use this discount.");
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await setDoc(
        userRef,
        {
          discountUsed: true,
          eligible: false,
          discountClaimed: true,
        },
        { merge: true },
      );

      setDiscountUsed(true);
      setDiscountClaimed(true);
      setDiscountAvailable(false);
      setIsDiscountApplied(false);

      return true;
    } catch (error) {
      console.error("Discount update error:", error);
      throw error;
    }
  }

  // Cart count
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );

  // Subtotal
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * (Number(item.quantity) || 1),
    0,
  );

  // Discount amount
  const discountAmount = isDiscountApplied ? Math.round(cartTotal * 0.15) : 0;

  // Final total
  const finalTotal = cartTotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        discountAmount,
        finalTotal,

        isDiscountApplied,
        discountClaimed,
        discountAvailable,
        discountUsed,
        discountLoading,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        applyDiscount,
        removeDiscount,
        markDiscountUsed,
        refreshDiscountStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
