"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useRef } from "react";

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Tilt state
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.warn("Video playback failed (mock source):", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="w-full bg-background py-24">
      <div className="max-w-[1400px] mx-auto px-6" style={{ perspective: 2000 }}>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4"
            >
              The Art of <span className="text-accent italic">Draping</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary/70 font-light text-lg"
            >
              Experience the fluidity, texture, and unmatched grace of our signature Banarasi silks and premium georgettes in motion.
            </motion.p>
          </div>
        </div>

        {/* Video Container */}
        <motion.div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-video w-full overflow-hidden bg-secondary group cursor-pointer border border-black/10 shadow-2xl rounded-sm"
          onClick={togglePlay}
          data-cursor="PLAY"
        >
          {/* We use a high-quality fashion stock video placeholder */}
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
            poster="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          />

          {/* Play Button Overlay */}
          <button 
            aria-label={isPlaying ? "Pause video" : "Play video"}
            onClick={togglePlay}
            className={`absolute inset-0 m-auto w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all duration-300 z-10 ${
              isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            }`}
          >
            <Play size={32} fill="currentColor" className="ml-1" />
          </button>
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/50 m-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/50 m-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>

      </div>
    </section>
  );
}
