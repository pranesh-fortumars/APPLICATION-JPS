"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Fashion Designer",
    text: "The quality of Banarasi silk from JPS Fabrics is unmatched. My latest bridal collection was elevated entirely by their premium textiles. Truly a designer's paradise.",
    rating: 5,
  },
  {
    id: 2,
    name: "Meera Reddy",
    role: "Boutique Owner",
    text: "I've been sourcing lining materials and falls from JPS for over 5 years. The consistency, luxurious feel, and customer service make them the best in Chennai.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ananya Iyer",
    role: "Loyal Customer",
    text: "Walking into JPS Fabrics feels like entering a museum of beautiful textiles. The sheer georgettes are breathtaking and drape perfectly.",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="w-full bg-dark text-secondary py-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
              A Legacy of <br /><span className="text-accent italic">Trust</span>
            </h2>
            <p className="text-secondary/70 font-light font-sans mb-8">
              Don't just take our word for it. Hear from the designers, creators, and elegant women who choose JPS Fabrics for their most important moments.
            </p>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="#D4AF37" color="#D4AF37" />
              ))}
            </div>
            <p className="text-sm font-semibold tracking-widest uppercase mt-4 text-secondary/50">
              4.9/5 Average Rating
            </p>
          </motion.div>
        </div>

        {/* Right Slider */}
        <div className="lg:col-span-8 relative">
          <Quote className="absolute -top-12 -left-8 text-white/5 w-32 h-32 z-0" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              effect="fade"
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="testimonials-swiper !pb-16"
            >
              {REVIEWS.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 md:p-12 rounded-sm flex flex-col gap-8">
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-white">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent text-dark flex items-center justify-center font-serif text-xl font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white tracking-wide">{review.name}</span>
                        <span className="text-xs text-accent uppercase tracking-widest">{review.role}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.2);
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #D4AF37;
          width: 30px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
}
