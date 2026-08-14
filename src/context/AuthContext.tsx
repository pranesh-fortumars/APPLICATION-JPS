"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCartStore } from "@/store/cartStore";
import { useRef } from "react";

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const isSyncingCart = useRef(false);

  // Subscribe to local cart changes to save to cloud
  useEffect(() => {
    const unsub = useCartStore.subscribe((state, prevState) => {
      // Only sync if user is logged in, and not currently syncing from a cloud pull, and items actually changed
      if (user && !isSyncingCart.current && state.items !== prevState.items) {
        setDoc(doc(db, "carts", user.uid), {
          items: state.items,
          totalItems: state.totalItems,
          totalPrice: state.totalPrice,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(console.error);
      }
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch or create user profile in Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        } else {
          // Create initial profile document
          const newProfile = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "",
            createdAt: new Date().toISOString(),
            role: "customer"
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
        }

        // Fetch user cart
        try {
          const cartRef = doc(db, "carts", firebaseUser.uid);
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            const data = cartSnap.data();
            if (data.items) {
              isSyncingCart.current = true;
              useCartStore.getState().setCart(data.items);
              // reset sync flag after state updates
              setTimeout(() => { isSyncingCart.current = false; }, 100);
            }
          }
        } catch(e) {
          console.error("Failed to fetch cart", e);
        }

      } else {
        setUserProfile(null);
        // Clear cart on logout
        useCartStore.getState().clearCart();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
