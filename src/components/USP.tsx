"use client";

import { Award, Layers, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const usps = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Sourced for excellence",
  },
  {
    icon: Layers,
    title: "Wide Range",
    description: "Endless possibilities",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On 10 meters or more",
  },
  {
    icon: ShieldCheck,
    title: "Trusted By",
    description: "Tailors & Designers",
  }
];

export default function USP() {
  return (
    <section className="py-20 bg-primary text-white w-full border-t-[4px] border-accent">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/20">
          
          {usps.map((usp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-4 group"
            >
              <usp.icon size={36} className="text-accent mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="font-serif text-xl font-bold mb-2 tracking-wide text-white">{usp.title}</h3>
              <p className="text-white/60 font-sans text-sm font-light">{usp.description}</p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
