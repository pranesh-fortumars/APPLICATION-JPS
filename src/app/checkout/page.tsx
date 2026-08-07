"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ShieldCheck, ChevronRight, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "", phone: "", firstName: "", lastName: "",
    address: "", city: "", state: "", pincode: ""
  });

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Razorpay window
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-32">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
            <Check size={48} />
          </motion.div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Order Confirmed!</h1>
          <p className="text-foreground/70 font-sans max-w-md mx-auto mb-8">
            Thank you for shopping with JPS Fabrics. Your order #JPS-{Math.floor(Math.random() * 100000)} has been placed successfully. We've sent a confirmation email to {formData.email}.
          </p>
          <Link href="/" className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors">
            Return to Boutique
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-32">
          <h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/collections" className="text-primary underline font-bold uppercase tracking-widest text-sm">Continue Shopping</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-20 py-32">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground/40 mb-12">
          <span className={step >= 1 ? "text-primary" : ""}>1. Details</span>
          <ChevronRight size={14} />
          <span className={step >= 2 ? "text-primary" : ""}>2. Shipping</span>
          <ChevronRight size={14} />
          <span className={step >= 3 ? "text-primary" : ""}>3. Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: Forms */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Step 1: Contact Details */}
            <div className={`p-8 border border-black/10 transition-colors ${step === 1 ? 'border-primary/50 shadow-ambient' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold">Contact Details</h2>
                {step > 1 && <button onClick={() => setStep(1)} className="text-xs uppercase font-bold text-accent">Edit</button>}
              </div>
              
              <AnimatePresence>
                {step === 1 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                      <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                    </div>
                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                    <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                    
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!formData.email || !formData.firstName}
                      className="mt-6 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm disabled:opacity-50"
                    >
                      Continue to Shipping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 2: Shipping */}
            <div className={`p-8 border border-black/10 transition-colors ${step === 2 ? 'border-primary/50 shadow-ambient' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold">Shipping Address</h2>
                {step > 2 && <button onClick={() => setStep(2)} className="text-xs uppercase font-bold text-accent">Edit</button>}
              </div>
              
              <AnimatePresence>
                {step === 2 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                    <input type="text" placeholder="Address (House No, Building, Street)" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                      <input type="text" placeholder="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                    </div>
                    <input type="text" placeholder="Pincode" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full sm:w-1/2 border border-black/10 px-4 py-3 outline-none focus:border-primary bg-transparent" />
                    
                    <button 
                      onClick={() => setStep(3)}
                      disabled={!formData.address || !formData.pincode}
                      className="mt-6 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm disabled:opacity-50"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 3: Payment */}
            <div className={`p-8 border border-black/10 transition-colors ${step === 3 ? 'border-primary/50 shadow-ambient' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold">Payment</h2>
              </div>
              
              <AnimatePresence>
                {step === 3 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    
                    <div className="p-6 border border-black/10 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input type="radio" checked readOnly className="accent-primary w-5 h-5" />
                        <span className="font-serif font-bold text-lg">Razorpay Secure</span>
                      </div>
                      <ShieldCheck className="text-primary" />
                    </div>

                    <p className="text-sm text-foreground/60 mb-8">
                      You will be redirected to Razorpay to complete your purchase securely. We accept UPI, Net Banking, and major Credit/Debit cards.
                    </p>
                    
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <><Lock size={16} /> Pay ₹{totalPrice}</>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 bg-secondary/30 border border-black/5">
              <h3 className="font-serif text-2xl font-bold mb-6 border-b border-black/10 pb-4">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-24 bg-white shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="font-serif font-bold text-sm line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-foreground/50 mt-1">{item.selectedColor || 'Default'} • {item.quantity}m</p>
                      <p className="mt-auto font-sans font-medium text-sm">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-black/10 pt-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Shipping</span>
                  <span className="font-medium text-accent">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold border-t border-black/10 pt-6">
                <span className="font-serif">Total</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
