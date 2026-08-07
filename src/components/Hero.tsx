"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";

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
      {/* Premium blush material with slight sheen */}
      <meshStandardMaterial 
        color="#E8B4B8" 
        roughness={0.2}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-secondary flex items-center justify-center">
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

      {/* Overlay Content aligned with Stitch UI */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-primary/80 tracking-[0.2em] uppercase mb-4 text-sm md:text-base font-semibold"
        >
          The Premium Boutique
        </motion.p>
        
        <motion.h1
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
          }}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl lg:text-9xl font-serif text-primary max-w-5xl leading-[1.1] mb-6 flex flex-col items-center"
        >
          <div className="overflow-hidden">
            <motion.span 
              variants={{ hidden: { y: "100%" }, visible: { y: 0, transition: { ease: [0.76, 0, 0.24, 1], duration: 1 } } }}
              className="inline-block italic font-light opacity-90"
            >
              Something New
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span 
              variants={{ hidden: { y: "100%" }, visible: { y: 0, transition: { ease: [0.76, 0, 0.24, 1], duration: 1 } } }}
              className="inline-block"
            >
              Is Here
            </motion.span>
          </div>
        </motion.h1>
        
        {/* Divider */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-px w-16 bg-primary/20"></div>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <div className="h-px w-16 bg-primary/20"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-primary/70 max-w-2xl text-xl md:text-2xl font-light mb-12"
        >
          Discover our latest collection of premium textiles, meticulously curated for elegance and crafted for perfection. Experience the tactile luxury of JPS Fabrics.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="pointer-events-auto"
        >
          <MagneticButton strength={0.4}>
            <Link
              href="/collections"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border border-primary/30 text-primary font-medium uppercase tracking-widest text-base hover:bg-primary hover:text-white transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Collections
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-primary/60 text-sm tracking-widest uppercase">Scroll to discover</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
}
