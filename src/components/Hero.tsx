"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";

// 3D Fabric Plane Component
function FabricMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionAttribute = meshRef.current.geometry.attributes.position;
    
    // Animate the vertices to create a waving fabric effect
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      
      // Complex wave math for fabric-like flow
      const z = Math.sin(x * 2 + time * 1.5) * 0.5 + Math.cos(y * 2 + time * 0.8) * 0.5;
      positionAttribute.setZ(i, z);
    }
    
    positionAttribute.needsUpdate = true;
    meshRef.current.rotation.x = -0.3; // Slight angle
    meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.1; // Slow rotation
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      {/* Plane geometry with many segments for smooth waves */}
      <planeGeometry args={[15, 10, 64, 64]} />
      {/* Premium burgundy material with slight sheen */}
      <meshStandardMaterial 
        color="#4A0D1A" 
        roughness={0.4}
        metalness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-dark flex items-center justify-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-70">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
          <directionalLight position={[-10, -10, 5]} intensity={0.5} color="#F7F3ED" />
          <FabricMesh />
        </Canvas>
      </div>

      {/* Floating Gold Particles Overlay (CSS based) */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="mb-4"
        >
          <span className="text-accent font-sans tracking-[0.3em] uppercase text-sm font-semibold">
            JPS Fabrics Exclusive
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-light font-bold leading-tight mb-8 drop-shadow-2xl"
        >
          Premium Fabrics <br/>
          <span className="text-accent italic font-light">For Elegant Creations</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="text-lg md:text-xl text-secondary/80 font-sans max-w-2xl mx-auto mb-12 font-light tracking-wide"
        >
          Discover a curated collection of luxury women's fabrics, lining materials, and falls designed for the modern boutique experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <button className="px-10 py-4 bg-accent text-dark font-sans font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-primary transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            Explore Collection
          </button>
          
          <button className="px-10 py-4 bg-transparent border border-secondary/30 text-secondary font-sans font-medium uppercase tracking-wider text-sm hover:border-accent hover:text-accent transition-all duration-300 backdrop-blur-sm">
            View Lookbook
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-secondary/60 text-xs tracking-widest uppercase">Scroll to discover</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
}
