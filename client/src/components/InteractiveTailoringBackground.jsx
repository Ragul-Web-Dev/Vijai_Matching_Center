import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveTailoringBackground() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState([]);
  const [clickSparks, setClickSparks] = useState([]);
  const sparkIdCounter = useRef(0);

  // Mouse move and click particle burst handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      setIsHovered(true);

      // Add trail point for thread ribbon effect
      setTrail((prev) => [
        ...prev.slice(-12),
        { x: clientX, y: clientY, id: Math.random() },
      ]);
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      const { clientX, clientY } = e;

      // Generate 8-12 sparkle particles on click
      const newSparks = Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const speed = 40 + Math.random() * 60;
        return {
          id: ++sparkIdCounter.current,
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          symbol: ['✨', '🪡', '🧵', '💎', '⭐'][Math.floor(Math.random() * 5)],
          color: ['#9333ea', '#d97706', '#ec4899', '#3b82f6'][Math.floor(Math.random() * 4)],
        };
      });

      setClickSparks((prev) => [...prev, ...newSparks]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Auto clean old click sparks
  useEffect(() => {
    if (clickSparks.length > 0) {
      const timer = setTimeout(() => {
        setClickSparks((prev) => prev.slice(5));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [clickSparks]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#f9f7fd]">
      {/* Dynamic Morphing Mesh Ambient Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          x: [0, 80, 0],
          y: [0, -50, 0],
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-gradient-to-br from-purple-400/40 via-purple-300/30 to-indigo-400/35 rounded-full blur-[140px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          x: [0, -90, 0],
          y: [0, 70, 0],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[30%] -right-32 w-[700px] h-[700px] bg-gradient-to-tr from-amber-400/35 via-purple-400/35 to-pink-300/30 rounded-full blur-[150px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 60, -60, 0],
          y: [0, -60, 60, 0],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-32 -left-20 w-[650px] h-[650px] bg-gradient-to-r from-purple-500/35 via-amber-300/30 to-indigo-400/35 rounded-full blur-[140px]"
      />

      {/* Interactive SVG Animated Silk Thread Waves & Embroidery Stitch Grid */}
      <svg className="w-full h-full absolute inset-0 opacity-35">
        <defs>
          <linearGradient id="gold-purple-thread" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#d97706" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
          </linearGradient>

          <pattern id="embroidery-stitch-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
            <path d="M 70 0 L 0 0 0 70" fill="none" stroke="#8b5cf6" strokeWidth="0.8" strokeDasharray="4 4" />
            {/* Cross Stitch Markers */}
            <path d="M 32 35 L 38 35 M 35 32 L 35 38" stroke="#d97706" strokeWidth="1" />
            <circle cx="0" cy="0" r="2.5" fill="#a855f7" />
            <circle cx="70" cy="0" r="2.5" fill="#a855f7" />
            <circle cx="0" cy="70" r="2.5" fill="#a855f7" />
            <circle cx="70" cy="70" r="2.5" fill="#a855f7" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#embroidery-stitch-pattern)" />

        {/* Dynamic Computerized Embroidery Stitch Paths */}
        <motion.path
          d="M -100,160 Q 350,20 750,300 T 1500,60 T 2100,360"
          fill="none"
          stroke="url(#gold-purple-thread)"
          strokeWidth="3"
          strokeDasharray="16 16"
          animate={{ strokeDashoffset: [0, -320] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        />

        <motion.path
          d="M -50,620 Q 500,900 950,520 T 1750,780 T 2200,480"
          fill="none"
          stroke="#d97706"
          strokeWidth="2.5"
          strokeDasharray="12 12"
          animate={{ strokeDashoffset: [0, 320] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        <motion.path
          d="M 150,-40 Q 600,420 1050,150 T 1650,650"
          fill="none"
          stroke="#ec4899"
          strokeWidth="2"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [0, -300] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Floating Interactive Tailoring Motifs */}
      {/* Golden Zari Spool */}
      <motion.div
        animate={{
          y: [0, -35, 0],
          x: [0, 25, 0],
          rotate: [0, 18, -12, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[14%] left-[4%] flex items-center gap-2 p-3.5 rounded-2xl bg-white/75 border-2 border-purple-200/80 backdrop-blur-md shadow-lg select-none z-10 hover:scale-110 transition-transform"
      >
        <span className="text-3xl filter drop-shadow-md">🧵</span>
        <div className="hidden md:block">
          <p className="text-[11px] font-bold text-purple-900 font-serif-heading">Golden Zari</p>
          <p className="text-[9px] font-mono text-amber-600 font-semibold">Color-Fast Thread</p>
        </div>
      </motion.div>

      {/* Precision Scissors */}
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          rotate: [0, -22, 14, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[24%] right-[5%] flex items-center gap-2 p-3.5 rounded-2xl bg-white/75 border-2 border-purple-200/80 backdrop-blur-md shadow-lg select-none z-10 hover:scale-110 transition-transform"
      >
        <span className="text-3xl filter drop-shadow-md">✂️</span>
        <div className="hidden md:block">
          <p className="text-[11px] font-bold text-purple-900 font-serif-heading">Precision Cut</p>
          <p className="text-[9px] font-mono text-purple-600 font-semibold">0.1mm Stitching</p>
        </div>
      </motion.div>

      {/* Embroidery Frame Hoop */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 35, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
        }}
        className="absolute top-[54%] left-[3%] flex items-center gap-2 p-3.5 rounded-full bg-white/75 border-2 border-indigo-200/80 backdrop-blur-md shadow-lg select-none z-10 hover:scale-110 transition-transform"
      >
        <span className="text-3xl filter drop-shadow-md">⭕</span>
        <span className="text-[10px] font-mono font-bold text-indigo-900 pr-2 hidden md:inline">20×32" Frame</span>
      </motion.div>

      {/* Multi-Needle Head */}
      <motion.div
        animate={{
          y: [0, 35, 0],
          x: [0, -25, 0],
          rotate: [0, -20, 20, 0],
        }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[72%] right-[6%] flex items-center gap-2 p-3.5 rounded-2xl bg-white/75 border-2 border-purple-200/80 backdrop-blur-md shadow-lg select-none z-10 hover:scale-110 transition-transform"
      >
        <span className="text-3xl filter drop-shadow-md">🪡</span>
        <div className="hidden md:block">
          <p className="text-[11px] font-bold text-purple-900 font-serif-heading">12 Needles</p>
          <p className="text-[9px] font-mono text-purple-600 font-semibold">Auto-Color Change</p>
        </div>
      </motion.div>

      {/* Decorative Floating Gems & Crown Badges */}
      <motion.div
        animate={{
          scale: [0.9, 1.4, 0.9],
          rotate: [0, 45, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] left-[2%] text-4xl filter drop-shadow-lg select-none z-10"
      >
        ✨
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[46%] right-[3%] text-4xl filter drop-shadow-lg select-none z-10"
      >
        👑
      </motion.div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[10%] left-[6%] text-3xl filter drop-shadow-lg select-none z-10"
      >
        💎
      </motion.div>

      {/* MAGICAL CURSOR TRAIL & SPARKLE BURST OVERLAY */}
      {isHovered && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Interpolated Thread Ribbon Trail */}
          {trail.map((pt, idx) => {
            const scale = (idx + 1) / trail.length;
            const opacity = ((idx + 1) / trail.length) * 0.7;
            return (
              <div
                key={pt.id}
                className="absolute rounded-full bg-gradient-to-r from-purple-500 via-amber-400 to-pink-500 pointer-events-none shadow-[0_0_10px_rgba(217,119,6,0.6)]"
                style={{
                  left: pt.x - 4,
                  top: pt.y - 4,
                  width: `${scale * 12}px`,
                  height: `${scale * 12}px`,
                  opacity,
                  transform: `scale(${scale})`,
                }}
              />
            );
          })}



          {/* Click Sparkle Explosion Particles */}
          {clickSparks.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{ x: spark.x, y: spark.y, opacity: 1, scale: 1 }}
              animate={{
                x: spark.x + spark.vx * 1.5,
                y: spark.y + spark.vy * 1.5,
                opacity: 0,
                scale: 0.3,
                rotate: 180,
              }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute text-xl pointer-events-none font-bold"
              style={{ color: spark.color }}
            >
              {spark.symbol}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
