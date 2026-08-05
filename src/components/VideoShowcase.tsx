"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useRef } from "react";

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="w-full bg-background py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl font-bold text-dark mb-4"
            >
              The Art of <span className="text-primary italic">Draping</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/70 font-light"
            >
              Experience the fluidity, texture, and unmatched grace of our signature Banarasi silks and premium georgettes in motion.
            </motion.p>
          </div>
        </div>

        {/* Video Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-video w-full overflow-hidden bg-secondary group cursor-pointer border border-black/10 dark:border-white/10 shadow-2xl"
          onClick={togglePlay}
        >
          {/* We use a high-quality fashion stock video placeholder */}
          <video
            ref={videoRef}
            src="https://assets.mixkit.co/videos/preview/mixkit-woman-spinning-in-a-beautiful-dress-4428-large.mp4"
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
            poster="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          />

          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-500 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <Play size={32} fill="currentColor" className="ml-1" />
            </div>
          </div>
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/50 m-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/50 m-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>

      </div>
    </section>
  );
}
