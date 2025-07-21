"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InterviewCard from "@/components/InterviewCard";
import CategoryCard from "@/components/CategoryCard";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import DSALearningPath from "@/components/DSALearningPath";
import DevelopmentLearningPath from "@/components/DevelopmentLearningPath";
import MLPythonLearningPath from "@/components/MLPythonLearningPath";
import { Brain, Mic, BarChart3, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { GridPattern } from "@/components/magicui/grid-pattern";

// Audio files arrays
const englishVoiceMemes = [
  "/english-voice/Voicy_Your actions have consequences (Download MP3).mp3",
  "/english-voice/Voicy_we do not care.mp3",
  "/english-voice/Voicy_Sad Violin.mp3",
  "/english-voice/Voicy_Michael Jordan_ Stop It, Get Some Help.mp3",
  "/english-voice/Voicy_Hey, that's pretty good!.mp3",
  "/english-voice/Voicy_FBI OPEN UP!.mp3",
  "/english-voice/Voicy_Emotional Damage.mp3",
  "/english-voice/Voicy_Ayo the pizza's here.mp3",
  "/english-voice/Voicy_Ah! I see you're a man of culture as well.mp3",
  "/english-voice/Voicy_69 - nice.mp3",
  "/english-voice/John Cena Bing Chilling.mp3",
  "/english-voice/I Like Ya Cut G.mp3",
  "/english-voice/Bruh Sound Effect #2.mp3",
  "/english-voice/Bonk.mp3",
  "/english-voice/Big Chungus.mp3",
  "/english-voice/Among Us Role Reveal Sound.mp3"
];

const hindiVoiceMemes = [
  "/hindi-voice/Voicy_Ye Karke Dikhao.mp3",
  "/hindi-voice/Voicy_Tareekh par tareekh.mp3",
  "/hindi-voice/Voicy_So Beatiful.mp3",
  "/hindi-voice/Voicy_Rishte mein to hum tumhare baap hote hain.mp3",
  "/hindi-voice/Voicy_Rahul Gandhi aloo sona machine.mp3",
  "/hindi-voice/Voicy_Padhaai Likhaai me dhyan do.mp3",
  "/hindi-voice/Voicy_Mere pas maa hai.mp3",
  "/hindi-voice/Voicy_Matlab Kuch bhi.mp3",
  "/hindi-voice/Voicy_khatam goodbye.mp3",
  "/hindi-voice/Voicy_He Prabhu.mp3",
  "/hindi-voice/Voicy_Control Uday control.mp3",
  "/hindi-voice/Voicy_Bolo Zubaan Kesari.mp3",
  "/hindi-voice/Voicy_Bhagwan ka diya sab kuch hai.mp3",
  "/hindi-voice/Voicy_Are kehna kya chahte ho.mp3",
  "/hindi-voice/Voicy_Abhi Maja ayega na Bhidu.mp3"
];

// Audio Player Component
const VoiceMemePlayer = ({ audioFiles, side, label }: {
  audioFiles: string[];
  side: 'left' | 'right';
  label: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playRandomMeme = () => {
    if (isPlaying && currentAudio) {
      // Stop current audio
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }

    // Play random audio
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const audio = new Audio(audioFiles[randomIndex]);
    
    audio.onloadeddata = () => {
      audio.play();
      setIsPlaying(true);
      setCurrentAudio(audio);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };
  };

  return (
    <motion.div
      className={`absolute top-1/2 transform -translate-y-1/2 z-30 ${
        side === 'left' ? 'left-[15%]' : 'right-[15%]'
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <motion.button
        onClick={playRandomMeme}
        className={`group relative w-16 h-16 rounded-full border-2 border-white bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isPlaying 
            ? 'border-green-400 bg-green-400/20 shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
            : 'hover:border-blue-400 hover:bg-blue-400/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-white" />
        ) : (
          <Play className="w-6 h-6 text-white ml-0.5" />
        )}
        
        {/* Label */}
        <div className={`absolute ${
          side === 'left' ? '-bottom-8 left-1/2 transform -translate-x-1/2' : '-bottom-8 left-1/2 transform -translate-x-1/2'
        } text-xs text-gray-400 font-medium whitespace-nowrap`}>
          {label}
        </div>

        {/* Pulse animation when playing */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
        )}
      </motion.button>
    </motion.div>
  );
};

const HowItWorksCard = ({ stepNumber, title, description, delay, icon, hoverColor }: {
  stepNumber: string;
  title: string;
  description: string;
  delay: number;
  icon: string;
  hoverColor: string;

}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getIcon = () => {
    switch (icon) {
      case 'mic':
        return <Mic className="w-10 h-10 text-white" />;
      case 'chart':
        return <BarChart3 className="w-10 h-10 text-white" />;
      default:
        return <div className="text-3xl font-bold text-white">{stepNumber}</div>;
    }
  };

  const getBorderColor = () => {
    switch (hoverColor) {
      case 'blue':
        return 'group-hover:border-blue-400';
      case 'green':
        return 'group-hover:border-green-400';
      case 'purple':
        return 'group-hover:border-purple-400';
      default:
        return 'group-hover:border-gray-300';
    }
  };

  const getTextColor = () => {
    switch (hoverColor) {
      case 'blue':
        return 'group-hover:text-blue-400';
      case 'green':
        return 'group-hover:text-green-400';
      case 'purple':
        return 'group-hover:text-purple-400';
      default:
        return 'group-hover:text-gray-300';
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ delay: delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)"
      }}
      className="text-center p-8 border border-white rounded-xl bg-black hover:border-gray-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative mb-8">
        <motion.div 
          whileHover={{ scale: 1.15, rotate: icon === 'mic' ? -10 : 10 }}
          className={`w-24 h-24 bg-black border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4 ${getBorderColor()} transition-all duration-300`}
        >
          {getIcon()}
        </motion.div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 border-2 border-gray-700 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      </div>
      <h3 className={`text-2xl font-semibold text-white mb-4 ${getTextColor()} transition-colors duration-300`}>{title}</h3>
      <p className="text-gray-400 text-lg">
        {description}
      </p>
    </motion.div>
  );
};

const CallToActionButton = ({ href, text, delay }: {
  href: string;
  text: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
      transition={{ delay: delay, duration: 0.6 }}
      className="text-center mt-16"
    >
      <Button
        asChild
        className="bg-white text-black hover:bg-gray-200 font-semibold px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
      >
        <Link href={href}>{text}</Link>
      </Button>
    </motion.div>
  );
};

const PricingCard = ({ plan, price, description, features, isPopular, delay, buttonText, buttonHref }: {
  plan: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
  delay: number;
  buttonText: string;
  buttonHref: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 50, opacity: 0, scale: 0.9 }}
      transition={{ delay: delay, duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        y: isPopular ? -10 : -5,
        scale: isPopular ? 1.05 : 1.02,
        boxShadow: isPopular ? "0 25px 50px rgba(255, 255, 255, 0.15)" : "0 20px 40px rgba(255, 255, 255, 0.1)"
      }}
      className={`p-8 ${isPopular ? 'border-2 border-white hover:border-blue-400' : 'border border-white hover:border-gray-300'} rounded-xl bg-black relative transition-all duration-300 cursor-pointer group`}
    >
      {isPopular && (
        <motion.div 
          whileHover={{ scale: 1.1, y: -2 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold group-hover:bg-blue-400 group-hover:text-white transition-all duration-300">
            Most Popular
          </div>
        </motion.div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2">{plan}</h3>
        <div className="text-4xl font-bold text-white mb-4">{price}</div>
        <p className="text-gray-400">{description}</p>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.li 
            key={index}
            whileHover={{ x: 5, color: isPopular ? "#3b82f6" : "#10b981" }}
            className="flex items-center text-gray-300 transition-colors duration-300"
          >
            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
            {feature}
          </motion.li>
        ))}
      </ul>
      
      <Button
        asChild
        className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <Link href={buttonHref}>{buttonText}</Link>
      </Button>
    </motion.div>
  );
};

const ResumeAnalyzerInView = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-bold text-white mb-4">AI-Resume Analyzer</h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Upload your resume and get comprehensive analysis with personalized recommendations
        </p>
      </motion.div>
      
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 30, opacity: 0, scale: 0.95 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <ResumeAnalyzer />
      </motion.div>
    </div>
  );
};

const ProductBannerInView = ({ src, alt, href, buttonText, delay, hoverColor, isFullWidth = false }: {
  src: string;
  alt: string;
  href: string;
  buttonText: string;
  delay: number;
  hoverColor: string;
  isFullWidth?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getHoverDirection = () => {
    switch (hoverColor) {
      case 'blue': return 2;
      case 'purple': return -2;
      case 'green': return 1;
      case 'orange': return -1;
      default: return 0;
    }
  };

  const getBorderHoverClass = () => {
    switch (hoverColor) {
      case 'blue': return 'group-hover:border-blue-400';
      case 'purple': return 'group-hover:border-purple-400';
      case 'green': return 'group-hover:border-green-400';
      case 'orange': return 'group-hover:border-orange-400';
      default: return 'group-hover:border-gray-400';
    }
  };

  const getButtonHoverClass = () => {
    switch (hoverColor) {
      case 'blue': return 'hover:bg-blue-400';
      case 'purple': return 'hover:bg-purple-400';
      case 'green': return 'hover:bg-green-400';
      case 'orange': return 'hover:bg-orange-400';
      default: return 'hover:bg-gray-400';
    }
  };

  // Check if href is internal (starts with /) or external
  const isInternalLink = href.startsWith('/');

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0, rotateY: -10 }}
      animate={isInView ? { y: 0, opacity: 1, rotateY: 0 } : { y: 50, opacity: 0, rotateY: -10 }}
      transition={{ delay: delay, duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        rotateY: getHoverDirection(),
        boxShadow: "0 25px 50px rgba(255, 255, 255, 0.2)"
      }}
      className="relative group cursor-pointer"
    >
      <div className={`relative overflow-hidden rounded-xl border border-white bg-black ${isFullWidth ? 'h-[300px]' : 'h-[400px]'} ${getBorderHoverClass()} transition-all duration-500`}>
        <motion.img 
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all duration-500"></div>
        
        {/* Button Overlay */}
        <div className="absolute bottom-8 right-8">
          <motion.div whileHover={{ scale: 1.15, rotate: getHoverDirection() }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className={`bg-white text-black ${getButtonHoverClass()} hover:text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 group-hover:shadow-2xl`}
            >
              {isInternalLink ? (
                <Link href={href}>
                  {buttonText}
                </Link>
              ) : (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {buttonText}
                </a>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

interface PageProps {
  userInterviews?: (any & { feedback?: any })[];
  latestInterviews?: (any & { feedback?: any })[];
  userId?: string;
}

const Page: React.FC<PageProps> = ({
  userInterviews = [],
  latestInterviews = [],
  userId,
}) => {
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex items-center justify-center min-h-[90vh] mb-16 overflow-hidden"
      >
        {/* Dot Pattern Background */}
        <DotPattern
          className={cn(
            "absolute inset-0 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          )}
        />
        {/* Left Phone Mockup */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ 
            scale: 1.05, 
            rotateY: -5,
            boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.2)"
          }}
          className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
        >
          <div className="w-80 h-[550px] bg-black border-2 border-white rounded-[2.5rem] p-3 shadow-2xl transition-all duration-300 hover:border-gray-300">
            {/* Phone notch */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-1 bg-white rounded-full opacity-50"></div>
            </div>
            
            {/* Phone screen */}
            <div className="bg-black rounded-[2rem] h-full p-6 flex flex-col border border-white relative">
              {/* Status bar */}
              <div className="flex justify-between items-center mb-4 text-white text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <span>100%</span>
                  <div className="w-6 h-3 border border-white rounded-sm">
                    <div className="w-full h-full bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-black border border-white rounded-full flex items-center justify-center"
                >
                  <Mic className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <div className="text-center mb-6">
                <h4 className="text-white font-semibold text-lg">AI Interviewer</h4>
                <div className="flex justify-center mt-3">
                  <div className="flex space-x-2 items-end h-10">
                    <div 
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '12px',
                        animation: 'soundWave 1s ease-in-out infinite',
                        animationDelay: '0s'
                      }}
                    ></div>
                    <div 
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '24px',
                        animation: 'soundWave 1s ease-in-out infinite',
                        animationDelay: '0.1s'
                      }}
                    ></div>
                    <div 
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '36px',
                        animation: 'soundWave 1s ease-in-out infinite',
                        animationDelay: '0.2s'
                      }}
                    ></div>
                    <div 
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '18px',
                        animation: 'soundWave 1s ease-in-out infinite',
                        animationDelay: '0.3s'
                      }}
                    ></div>
                    <div 
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '30px',
                        animation: 'soundWave 1s ease-in-out infinite',
                        animationDelay: '0.4s'
                      }}
                    ></div>
                    <div 
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '12px',
                        animation: 'soundWave 1s ease-in-out infinite',
                        animationDelay: '0.5s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-black rounded-lg p-4 text-sm text-gray-300 border border-white hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 cursor-pointer">
                "Can you explain the difference between React hooks and class components?"
              </div>
              
              {/* Home indicator */}
              <div className="flex justify-center mt-auto pt-4">
                <div className="w-20 h-1 bg-white rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Phone Mockup */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ 
            scale: 1.05, 
            rotateY: 5,
            boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.2)"
          }}
          className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
        >
          <div className="w-80 h-[550px] bg-black border-2 border-white rounded-[2.5rem] p-3 shadow-2xl transition-all duration-300 hover:border-gray-300">
            {/* Phone notch */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-1 bg-white rounded-full opacity-50"></div>
            </div>
            
            {/* Phone screen */}
            <div className="bg-black rounded-[2rem] h-full p-6 flex flex-col border border-white relative">
              {/* Status bar */}
              <div className="flex justify-between items-center mb-4 text-white text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <span>100%</span>
                  <div className="w-6 h-3 border border-white rounded-sm">
                    <div className="w-full h-full bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  className="text-6xl font-bold text-white cursor-pointer"
                >
                  85%
                </motion.div>
              </div>
              <div className="text-center mb-6">
                <h4 className="text-white font-semibold text-lg">Your Score</h4>
              </div>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex justify-between items-center bg-black rounded-lg p-3 border border-white hover:border-green-400 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-gray-300 text-base">Technical</span>
                  <span className="text-white font-semibold text-lg">90%</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex justify-between items-center bg-black rounded-lg p-3 border border-white hover:border-yellow-400 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-gray-300 text-base">Communication</span>
                  <span className="text-white font-semibold text-lg">78%</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex justify-between items-center bg-black rounded-lg p-3 border border-white hover:border-blue-400 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-gray-300 text-base">Problem Solving</span>
                  <span className="text-white font-semibold text-lg">87%</span>
                </motion.div>
              </div>
              
              {/* Home indicator */}
              <div className="flex justify-center mt-auto pt-4">
                <div className="w-20 h-1 bg-white rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Central Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center z-20"
        >
          <h1 className="text-7xl font-bold text-white mb-8 leading-tight">
            Ace Your<br />
            Next Interview
          </h1>
          
          <div className="flex justify-center mb-8 relative">
            {/* English Voice Meme Player - Left Side */}
            <VoiceMemePlayer
              audioFiles={englishVoiceMemes}
              side="left"
              label="English-Memes"
            />

            {/* Brain SVG */}
            <motion.div 
              className="w-32 h-32 bg-black rounded-full flex items-center justify-center border-2 border-gray-700 cursor-pointer"
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                borderColor: "#ffffff",
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)"
              }}
              transition={{ duration: 0.6 }}
              style={{
                animation: 'brainPulse 2s ease-in-out infinite'
              }}
            >
              <Brain className="w-16 h-16 text-white" />
            </motion.div>

            {/* Hindi Voice Meme Player - Right Side */}
            <VoiceMemePlayer
              audioFiles={hindiVoiceMemes}
              side="right"
              label="Hindi-Memes"
            />
          </div>
          
          <p className="text-gray-400 text-xl mb-4">
            AI-powered mock interviews that feel real
          </p>
          
          <h2 className="text-3xl font-bold text-white mb-8">
            Tailored For Indian Audience
          </h2>
          
          <Button
            asChild
            className="bg-white text-black hover:bg-gray-200 font-semibold px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
          >
            <Link href="/interview">Get Started</Link>
          </Button>
        </motion.div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes soundWave {
            0%, 100% {
              transform: scaleY(0.5);
            }
            50% {
              transform: scaleY(1.5);
            }
          }
          
          @keyframes brainPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
          }
        `}</style>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Get interview-ready in just 3 simple steps with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <HowItWorksCard
              stepNumber="1"
              title="Choose Your Role"
              description="Select your target position and skill level. Our AI will customize questions specifically for your career goals."
              delay={0.2}
              icon="number"
              hoverColor="blue"
            />

            {/* Step 2 */}
            <HowItWorksCard
              stepNumber="2"
              title="Practice Live"
              description="Engage in real-time conversations with our AI interviewer. Experience realistic interview scenarios with voice interaction."
              delay={0.4}
              icon="mic"
              hoverColor="green"
            />

            {/* Step 3 */}
            <HowItWorksCard
              stepNumber="3"
              title="Get Feedback"
              description="Receive detailed analysis of your performance with personalized recommendations to improve your interview skills."
              delay={0.6}
              icon="chart"
              hoverColor="purple"
            />
          </div>

          {/* Call to Action */}
          <CallToActionButton 
            href="/interview"
            text="Start Your First Interview"
            delay={0.8}
          />
        </div>
      </motion.div>

      {/* Resume Analyzer Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Grid Pattern Background with Linear Gradient */}
        <GridPattern
          width={20}
          height={20}
          x={-1}
          y={-1}
          className={cn(
            "absolute inset-0 [mask-image:linear-gradient(to_bottom_right,white,transparent,white)]",
          )}
        />
        <div className="relative max-w-6xl mx-auto">
          <ResumeAnalyzerInView />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Start free, upgrade when you're ready to dominate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              plan="Free"
              price="$0"
              description="Perfect for getting started"
              features={[
                "3 mock interviews per month",
                "Basic feedback analysis",
                "Resume analysis (1 per month)",
                "Standard question bank"
              ]}
              isPopular={false}
              delay={0.2}
              buttonText="Get Started Free"
              buttonHref="/sign-up"
            />

            <PricingCard
              plan="Pro"
              price="$19/month"
              description="For serious job seekers"
              features={[
                "Unlimited mock interviews",
                "Advanced AI feedback",
                "Unlimited resume analysis",
                "Industry-specific questions",
                "Performance tracking",
                "Priority support"
              ]}
              isPopular={true}
              delay={0.4}
              buttonText="Start Pro Trial"
              buttonHref="/sign-up"
            />

            <PricingCard
              plan="Enterprise"
              price="Custom"
              description="For teams and organizations"
              features={[
                "Everything in Pro",
                "Team management",
                "Custom integrations",
                "Analytics dashboard",
                "Dedicated support",
                "SLA guarantee"
              ]}
              isPopular={false}
              delay={0.6}
              buttonText="Contact Sales"
              buttonHref="/contact"
            />
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-16"
          >
            <p className="text-gray-400 text-lg mb-4">
              All plans include a 7-day free trial. No credit card required.
            </p>
            <p className="text-gray-500 text-sm">
              Cancel anytime • Upgrade or downgrade as needed
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Our Products</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Discover our suite of AI-powered tools designed to accelerate your coding journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
          

            <ProductBannerInView
              src="/NotesLoBanner.png"
              alt="Notesलो - AI Coding Notetaker"
              href="https://notes-16q6.vercel.app"
              buttonText="Try Now"
              delay={0.2}
              hoverColor="blue"
            />

            <ProductBannerInView
              src="/GuidanceLoBanner.png"
              alt="Guidanceलो - Visual Roadmap Maker"
              href="https://guidance-lo.vercel.app"
              buttonText="Try Now"
              delay={0.4}
              hoverColor="purple"
            />

            <ProductBannerInView
              src="/JobLoBanner.png"
              alt="Jobलो - AI Job Search Platform"
              href="https://job-lo.vercel.app"
              buttonText="Try Now"
              delay={0.8}
              hoverColor="orange"
            />

            <ProductBannerInView
              src="/ConsultLoBanner.png"
              alt="Consultलो - AI Consultation Platform"
              href="https://consultlo.netlify.app/"
              buttonText="Try Now"
              delay={0.6}
              hoverColor="green"
            />

              {/* InterviewLo Banner - Spans full width (2 columns) */}
            <div className="md:col-span-2">
              <ProductBannerInView
                src="/InterviewLoBanner.jpg"
                alt="InterviewLo - AI Mock Interview Platform"
                href="/interview"
                buttonText="Create Interview"
                delay={0.1}
                hoverColor="blue"
                isFullWidth={true}
              />
            </div>

            
          </div>
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-white text-2xl font-semibold">Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={interview.feedback}
              />
            ))
          ) : (
            <p className="text-light-100">
              You haven&apos;t taken any interviews yet
            </p>
          )}
        </div>
      </section>

      {/* Take an Interview Section */}
      <section className="flex flex-col gap-6 mt-8">
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={interview.feedback}
              />
            ))
          ) : (
            <p className="text-light-100">
            </p>
          )}
        </div>
      </section>

      {/* DSA Learning Path Section */}
      <DSALearningPath />

      {/* Development Learning Path Section */}
      <DevelopmentLearningPath />

      {/* ML + Python Backend Learning Path Section */}
      <MLPythonLearningPath />
    </div>
  );
};
export default Page;
