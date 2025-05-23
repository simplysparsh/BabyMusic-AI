import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import SoundThreadAnimationMobile from './SoundThreadAnimationMobile';

interface SoundThreadAnimationProps {
  isGenerating: boolean;
  progress: number;
  timeLeft: number;
}

interface ThreadPath {
  id: number;
  color: string;
  amplitude: number;
  frequency: number;
  phase: number;
  thickness: number;
}

export default function SoundThreadAnimation({
  isGenerating,
  progress,
  timeLeft
}: SoundThreadAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Generate thread configurations - moved before any early returns
  const threads: ThreadPath[] = useMemo(() => [
    { id: 1, color: '#FF6B6B', amplitude: 30, frequency: 2, phase: 0, thickness: 3 },
    { id: 2, color: '#4ECDC4', amplitude: 25, frequency: 2.5, phase: Math.PI / 3, thickness: 2.5 },
    { id: 3, color: '#FFE66D', amplitude: 35, frequency: 1.8, phase: Math.PI / 2, thickness: 2.8 },
    { id: 4, color: '#A8E6CF', amplitude: 28, frequency: 2.2, phase: Math.PI / 4, thickness: 2.3 },
    { id: 5, color: '#C7CEEA', amplitude: 32, frequency: 2.7, phase: Math.PI / 6, thickness: 2.6 }
  ], []);

  // Calculate time display - moved before any early returns
  const displayTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Check if on mobile device or small screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate threads based on generation state
  useEffect(() => {
    if (isGenerating && !isMobile) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.5 }
      });
    } else if (!isMobile) {
      controls.start({
        opacity: 0,
        transition: { duration: 0.5 }
      });
    }
  }, [isGenerating, controls, isMobile]);

  // Generate wave path with proper error handling
  const generateWavePath = useMemo(() => {
    return (thread: ThreadPath, progressOffset: number): string => {
      const width = 300;
      const height = 200;
      const centerY = height / 2;
      
      try {
        // Validate input parameters
        if (!thread || typeof progressOffset !== 'number') {
          return `M 0,${centerY} L ${width},${centerY}`;
        }
        
        const points: string[] = [];

        for (let x = 0; x <= width; x += 4) { // Increased step for simpler paths
          const normalizedX = x / width;
          const waveY = Math.sin(
            (normalizedX * Math.PI * thread.frequency) + 
            thread.phase + 
            (progressOffset * Math.PI * 2)
          ) * thread.amplitude;
          
          // Add some randomness for organic feel
          const noise = Math.sin(normalizedX * 50) * 2;
          const y = centerY + waveY + noise;
          
          // Ensure valid coordinates
          if (isFinite(x) && isFinite(y)) {
            points.push(`${x},${y}`);
          }
        }

        return points.length > 0 ? `M ${points.join(' L ')}` : `M 0,${centerY} L ${width},${centerY}`;
      } catch (error) {
        console.warn('Error generating wave path:', error);
        // Fallback to straight line
        return `M 0,${centerY} L ${width},${centerY}`;
      }
    };
  }, []);

  // Generate static base paths for each thread
  const getBasePath = useMemo(() => {
    return (thread: ThreadPath): string => {
      return generateWavePath(thread, 0);
    };
  }, [generateWavePath]);
  
  // Use mobile version for better performance on mobile devices
  if (isMobile) {
    return (
      <SoundThreadAnimationMobile
        isGenerating={isGenerating}
        progress={progress}
        timeLeft={timeLeft}
      />
    );
  }

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      initial={{ opacity: 0 }}
      className="relative w-full max-w-sm mx-auto my-8 px-4"
    >
      {/* Main animation container */}
      <div className="relative h-52 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/5">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-pink-900/10" />
        
        {/* Sound threads SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 300 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filter for threads */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Gradient definitions for each thread */}
            {threads.map((thread) => (
              <linearGradient key={`gradient-${thread.id}`} id={`gradient-${thread.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={thread.color} stopOpacity="0.1" />
                <stop offset="20%" stopColor={thread.color} stopOpacity="0.8" />
                <stop offset="50%" stopColor={thread.color} stopOpacity="1" />
                <stop offset="80%" stopColor={thread.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={thread.color} stopOpacity="0.1" />
              </linearGradient>
            ))}
          </defs>

          {/* Animated sound threads - using transforms instead of path animation */}
          {threads.map((thread, index) => (
            <motion.g
              key={thread.id}
              animate={{
                x: [0, 5, -5, 3, 0],
                y: [0, 2, -2, 1, 0]
              }}
              transition={{
                duration: 4 + (index * 0.5),
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <path
                d={getBasePath(thread)}
                stroke={`url(#gradient-${thread.id})`}
                strokeWidth={thread.thickness}
                fill="none"
                filter="url(#glow)"
                style={{
                  opacity: 0.8,
                  mixBlendMode: 'screen'
                }}
              />
              {/* Additional animated elements for more dynamic effect */}
              <motion.path
                d={getBasePath(thread)}
                stroke={thread.color}
                strokeWidth={1}
                fill="none"
                opacity={0.3}
                animate={{
                  pathLength: [0, 1, 0],
                  strokeDasharray: ["0 100", "50 50", "100 0"]
                }}
                transition={{
                  duration: 3 + (index * 0.3),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.g>
          ))}

          {/* Progress indicator line */}
          <motion.line
            x1={0}
            y1={100}
            x2={300}
            y2={100}
            stroke="white"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity={0.2}
          />
          
          <motion.line
            x1={0}
            y1={100}
            x2={300 * (progress / 100)}
            y2={100}
            stroke="white"
            strokeWidth="2"
            opacity={0.5}
            initial={{ x2: 0 }}
            animate={{ x2: 300 * (progress / 100) }}
            transition={{ ease: "linear" }}
          />
        </svg>

        {/* Particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * 300,
                y: 200,
                opacity: 0
              }}
              animate={{
                y: -20,
                opacity: [0, 0.8, 0],
                x: Math.random() * 300
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
              style={{
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
              }}
            />
          ))}
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* Musical note icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-3"
          >
            <div className="text-4xl">🎵</div>
          </motion.div>

          {/* Status text */}
          <motion.p
            className="text-white/90 text-sm font-medium mb-1"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Weaving your melody
          </motion.p>

          {/* Time display */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-xs font-mono">{displayTime}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
            style={{ width: `${progress}%` }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>

      {/* Fun messages */}
      <motion.div
        className="text-center mt-3"
        animate={{
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          times: [0, 0.1, 0.9, 1]
        }}
      >
        <p className="text-white/60 text-xs">
          {progress < 25 && "✨ Gathering stardust melodies..."}
          {progress >= 25 && progress < 50 && "🎨 Painting with sound colors..."}
          {progress >= 50 && progress < 75 && "🌙 Adding moonlight harmonies..."}
          {progress >= 75 && "🎁 Wrapping your musical gift..."}
        </p>
      </motion.div>
    </motion.div>
  );
} 