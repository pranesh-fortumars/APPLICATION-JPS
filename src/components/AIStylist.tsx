"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { mockProducts } from "@/lib/mockData";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  products?: any[];
}

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Hi! I'm your JPS AI Stylist. Tell me what occasion you're shopping for, or what fabric you're looking for, and I'll find the perfect match!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Cache products for fast local searching
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch products quietly in the background when component mounts
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        if (snap.docs.length === 0) {
          setAllProducts(mockProducts);
        } else {
          setAllProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (e) {
        console.error("Failed to preload products for AI", e);
        setAllProducts(mockProducts);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    
    // Add User Message
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate Network/Thinking delay
    setTimeout(() => {
      const lowerInput = userText.toLowerCase();
      
      // Basic heuristic keyword matching
      let recommendedProducts = allProducts.filter(p => {
        const textToSearch = `${p.name} ${p.description} ${p.material} ${p.category} ${p.colors?.join(" ")}`.toLowerCase();
        
        // Find if any word in the user's prompt (longer than 3 chars) exists in the product text
        const words = lowerInput.split(" ").filter(w => w.length > 3);
        return words.some(w => textToSearch.includes(w));
      });

      // Limit to top 3
      recommendedProducts = recommendedProducts.slice(0, 3);

      let aiText = "Here are a few options I found that might be perfect for you!";
      
      if (recommendedProducts.length === 0) {
        // Fallback to random if no match found
        recommendedProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 2);
        aiText = "I couldn't find an exact match for that, but here are some of our trending fabrics you might love instead!";
      }

      if (lowerInput.includes("wedding") || lowerInput.includes("bride")) {
        aiText = "For a wedding, you definitely want something luxurious. I highly recommend these premium selections:";
      } else if (lowerInput.includes("summer") || lowerInput.includes("cotton")) {
        aiText = "For warm weather, breathability is key. These fabrics are light and comfortable:";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        products: recommendedProducts
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-40 group"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        <span className="absolute -top-10 right-0 bg-dark text-white text-[10px] px-3 py-1 rounded-sm uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Ask AI Stylist
        </span>
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border border-black/10"
          >
            {/* Header */}
            <div className="bg-dark p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">JPS Stylist</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">AI Powered</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  
                  {/* Chat Bubble */}
                  <div className={`max-w-[85%] p-3 text-sm rounded-2xl ${
                    msg.sender === "user" 
                      ? "bg-primary text-white rounded-br-sm" 
                      : "bg-white border border-black/5 text-dark rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>

                  {/* Product Cards injected by AI */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 w-[85%]">
                      {msg.products.map(product => (
                        <Link href={`/collections/${product.id}`} key={product.id} onClick={() => setIsOpen(false)} className="flex items-center gap-3 bg-white p-2 rounded-sm border border-black/5 hover:border-primary transition-colors group">
                          <div className="w-12 h-12 relative bg-secondary rounded-sm overflow-hidden shrink-0">
                            {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold font-serif truncate group-hover:text-primary transition-colors">{product.name}</p>
                            <p className="text-[10px] text-foreground/50 mt-1">₹{product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-2 text-foreground/40 text-xs">
                  <Loader2 size={12} className="animate-spin" /> Stylist is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-black/5 flex items-center gap-2 shrink-0">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about fabrics, outfits, occasions..."
                className="flex-1 bg-secondary/30 border border-black/5 rounded-full px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send size={16} className="-ml-1" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
