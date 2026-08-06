"use client";

import { motion } from "framer-motion";
import { Award, Layers, Truck, ShieldCheck } from "lucide-react";

const USP_DATA = [
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
    <section className="py-20 maroon-bg text-white w-full border-t-[4px] border-[#775a19]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/20">
          
          {USP_DATA.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center p-4 group"
            >
              <item.icon className="text-[#ffdea5] mb-4 group-hover:scale-110 transition-transform duration-300" size={40} strokeWidth={1.5} />
              <h4 className="font-sans text-xs uppercase tracking-widest text-[#ffdea5] mb-2 font-semibold">
                {item.title}
              </h4>
              <p className="font-sans text-white/80 text-sm font-light">
                {item.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
