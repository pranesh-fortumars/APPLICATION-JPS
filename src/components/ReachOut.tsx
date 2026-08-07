"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ReachOut() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Text & Contact Info */}
          <div className="flex-1">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold uppercase tracking-widest text-xs mb-4"
            >
              Get In Touch
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl font-bold text-primary mb-6"
            >
              Reach Out to Us
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-sans text-foreground/70 font-light mb-12 max-w-md"
            >
              If you have any questions or need assistance, feel free to contact us through the details below.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-10"
            >
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-sans font-bold text-lg text-primary">Email Address</h4>
                  <a href="mailto:contact@jpsfabrics.com" className="text-foreground/70 hover:text-accent transition-colors">contact@jpsfabrics.com</a>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-sans font-bold text-lg text-primary">Phone Number</h4>
                  <a href="tel:+918939695455" className="text-foreground/70 hover:text-accent transition-colors">+91 89396 95455</a>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-sans font-bold text-lg text-primary">Our Office</h4>
                  <p className="text-foreground/70 leading-relaxed max-w-xs">
                    No.347 D P.H Road, Aminjikarai, Chennai - 29
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Map Embed */}
          <div className="flex-1 w-full relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-full h-[400px] lg:h-full min-h-[400px] bg-secondary shadow-2xl relative overflow-hidden"
            >
              <iframe
                src="https://maps.google.com/maps?q=Aminjikarai,Chennai&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
