'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Youtube, 
  ExternalLink, 
  Code, 
  Brain, 
  Target, 
  Trophy,
  Calendar,
  Clock,
  Star,
  Users,
  ChevronRight,
  PlayCircle,
  FileText,
  Award
} from 'lucide-react';

interface LearningResource {
  title: string;
  description: string;
  url: string;
  type: 'sheet' | 'video' | 'platform' | 'book';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isRecommended?: boolean;
}

interface YouTubeChannel {
  name: string;
  creator: string;
  speciality: string;
  url: string;
  subscribers?: string;
  isRecommended?: boolean;
}

interface Platform {
  name: string;
  description: string;
  url: string;
  features: string[];
  isFree: boolean;
  isRecommended?: boolean;
}

const learningPaths: LearningResource[] = [
  {
    title: "Striver's A2Z DSA Sheet",
    description: "Structured day-wise plan from basics to advanced. Covers Leetcode 150, and must-do GFG topics",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    type: 'sheet',
    difficulty: 'Beginner',
    isRecommended: true
  },
  {
    title: "Love Babbar's 450 DSA Sheet",
    description: "Legacy sheet, still very effective. Covers questions from all major platforms",
    url: "https://450dsa.com/",
    type: 'sheet',
    difficulty: 'Intermediate'
  },
  {
    title: "Fraz's Leetcode 75 + 150 Sheet",
    description: "Focuses on Leetcode patterns. Covers blind 75 + system design basics",
    url: "https://www.youtube.com/@mohammad_fraz",
    type: 'sheet',
    difficulty: 'Advanced'
  },
  {
    title: "CodeHelp by Babbar",
    description: "A full paid course + YouTube free content. Code + MCQ-based explanations",
    url: "https://www.codehelp.in/",
    type: 'platform',
    difficulty: 'Beginner'
  }
];

const youtubeChannels: YouTubeChannel[] = [
  {
    name: "Striver",
    creator: "Raj Vikramaditya",
    speciality: "A2Z DSA Sheet, clean explanations",
    url: "https://www.youtube.com/@takeUforward",
    subscribers: "600K+",
    isRecommended: true
  },
  {
    name: "Love Babbar",
    creator: "Love Babbar",
    speciality: "Practical explanations, 450 DSA",
    url: "https://www.youtube.com/@CodeHelp",
    subscribers: "1M+"
  },
  {
    name: "Aditya Verma",
    creator: "Aditya Verma",
    speciality: "DP, Recursion, Stack/Queue patterns",
    url: "https://www.youtube.com/@AdityaVermaTheProgrammingLord",
    subscribers: "500K+"
  },
  {
    name: "Fraz",
    creator: "Mohammad Fraz",
    speciality: "Leetcode focused + FAANG prep",
    url: "https://www.youtube.com/@mohammad_fraz",
    subscribers: "400K+"
  },
  {
    name: "CodeWithHarry",
    creator: "Haris Khan",
    speciality: "Beginners intro to programming + DSA",
    url: "https://www.youtube.com/@CodeWithHarry",
    subscribers: "4M+"
  }
];

const platforms: Platform[] = [
  {
    name: "Leetcode",
    description: "Most Relevant for Interviews. Start with Leetcode Blind 75, then do Leetcode Top 150",
    url: "https://leetcode.com/",
    features: ["Blind 75", "Top 150", "Contest Platform", "Company-wise questions"],
    isFree: true,
    isRecommended: true
  },
  {
    name: "GeeksforGeeks",
    description: "Ideal for CS fundamentals + language-specific topics",
    url: "https://www.geeksforgeeks.org/",
    features: ["SDE Sheet", "Interview Prep", "Theory & Practice", "Articles"],
    isFree: true
  },
  {
    name: "InterviewBit",
    description: "Structured level-wise track. Good for time-bound practice",
    url: "https://www.interviewbit.com/",
    features: ["Level-wise tracks", "Timed practice", "Mock interviews", "Structured roadmaps"],
    isFree: true
  },
  {
    name: "Coding Ninjas Studio",
    description: "Curated problems + mock contests. Offers curated roadmaps + notes",
    url: "https://www.codingninjas.com/studio",
    features: ["Curated problems", "Mock contests", "Roadmaps", "Notes"],
    isFree: true
  }
];

const bonusResources = [
  {
    title: "CS50 + MIT OCW",
    description: "Theory heavy, for deep learners. For understanding how DSA concepts work internally",
    url: "https://cs50.harvard.edu/",
    type: "theory"
  },
  {
    title: "Cracking the Coding Interview",
    description: "Industry standard, excellent for Amazon/Google/Meta style interviews",
    url: "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850",
    type: "book",
    isRecommended: true
  }
];

export default function DSALearningPath() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'youtube' | 'platforms' | 'bonus'>('roadmap');
  const [isLoading, setIsLoading] = useState(false);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const renderResourceCard = (resource: LearningResource, index: number) => (
    <motion.div
      key={resource.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`relative card-border group cursor-pointer ${resource.isRecommended ? 'ring-2 ring-primary-200' : ''}`}
    >
      {resource.isRecommended && (
        <div className="absolute -top-2 -right-2 bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="w-3 h-3 mr-1" />
          RECOMMENDED
        </div>
      )}
      
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-200/20 rounded-lg">
              {resource.type === 'sheet' && (
                <svg className="w-6 h-6 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              )}
              {resource.type === 'video' && (
                <svg className="w-6 h-6 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5V7.5L16,12M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z" />
                </svg>
              )}
              {resource.type === 'platform' && (
                <svg className="w-6 h-6 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
                </svg>
              )}
              {resource.type === 'book' && (
                <svg className="w-6 h-6 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,20.9 22.25,21.56C22.35,21.61 22.4,21.66 22.5,21.66C22.75,21.66 23,21.41 23,21.16V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,19.81C10.65,18.9 8.2,18.5 6.5,18.5C5.3,18.5 4.1,18.65 3,19V6.5C4.45,5.4 6.55,5 8.5,5H9V6.5C9,7.5 9.5,8 10.5,8H11.5C12.5,8 13,7.5 13,6.5V5H17.5C18.9,5 20.15,5.25 21,5.5V2L14,6.5V17.5L19,13V2M6.5,5Z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                resource.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                resource.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {resource.difficulty}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-light-100 mb-4 text-sm leading-relaxed">{resource.description}</p>
        
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-200 hover:text-primary-100 transition-all duration-200 text-sm font-medium group-hover:translate-x-1"
        >
          Access Resource
          <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
        </a>
      </div>
    </motion.div>
  );

  const renderYouTubeCard = (channel: YouTubeChannel, index: number) => (
    <motion.div
      key={channel.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`card-border group cursor-pointer ${channel.isRecommended ? 'ring-2 ring-primary-200' : ''}`}
    >
      {channel.isRecommended && (
        <div className="absolute -top-2 -right-2 bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="w-3 h-3 mr-1" />
          RECOMMENDED
        </div>
      )}
      
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Youtube className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
              <p className="text-light-400 text-sm">by {channel.creator}</p>
              {channel.subscribers && (
                <div className="flex items-center mt-1">
                  <Users className="w-3 h-3 text-light-400 mr-1" />
                  <span className="text-xs text-light-400">{channel.subscribers}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-light-100 mb-4 text-sm">{channel.speciality}</p>
        
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-red-500 hover:text-red-400 transition-all duration-200 text-sm font-medium group-hover:translate-x-1"
        >
          Visit Channel
          <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
        </a>
      </div>
    </motion.div>
  );

  const renderPlatformCard = (platform: Platform, index: number) => (
    <motion.div
      key={platform.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`card-border group cursor-pointer ${platform.isRecommended ? 'ring-2 ring-primary-200' : ''}`}
    >
      {platform.isRecommended && (
        <div className="absolute -top-2 -right-2 bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="w-3 h-3 mr-1" />
          RECOMMENDED
        </div>
      )}
      
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Code className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                platform.isFree ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {platform.isFree ? 'Free' : 'Paid'}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-light-100 mb-4 text-sm leading-relaxed">{platform.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Features:</h4>
          <div className="flex flex-wrap gap-1">
            {platform.features.map((feature, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-primary-200/20 text-primary-200 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-all duration-200 text-sm font-medium group-hover:translate-x-1"
        >
          Visit Platform
          <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
        </a>
      </div>
    </motion.div>
  );

  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <div className="p-3 bg-primary-200/20 rounded-full mr-0 sm:mr-4 mb-4 sm:mb-0 relative">
              {/* Animated Brain SVG */}
              <svg className="w-8 h-8 text-primary-200 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.33,12.91C21.33,14.21 20.77,15.4 19.82,16.21C20.37,16.72 20.7,17.41 20.7,18.18C20.7,19.93 19.28,21.35 17.53,21.35C16.8,21.35 16.13,21.07 15.62,20.6C15.08,21.07 14.4,21.35 13.65,21.35C12.22,21.35 11.04,20.32 10.78,18.96C10.33,19.14 9.84,19.24 9.32,19.24C7.57,19.24 6.15,17.82 6.15,16.07C6.15,15.3 6.4,14.58 6.82,14C6.4,13.42 6.15,12.7 6.15,11.93C6.15,10.18 7.57,8.76 9.32,8.76C9.84,8.76 10.33,8.86 10.78,9.04C11.04,7.68 12.22,6.65 13.65,6.65C14.4,6.65 15.08,6.93 15.62,7.4C16.13,6.93 16.8,6.65 17.53,6.65C19.28,6.65 20.7,8.07 20.7,9.82C20.7,10.59 20.37,11.28 19.82,11.79C20.77,12.6 21.33,13.79 21.33,15.09M19.13,12.91C19.13,11.95 18.35,11.17 17.39,11.17C16.43,11.17 15.65,11.95 15.65,12.91C15.65,13.87 16.43,14.65 17.39,14.65C18.35,14.65 19.13,13.87 19.13,12.91M17.22,9.82C17.22,9.11 16.64,8.53 15.93,8.53C15.22,8.53 14.64,9.11 14.64,9.82C14.64,10.53 15.22,11.11 15.93,11.11C16.64,11.11 17.22,10.53 17.22,9.82M14.34,13.73C14.34,13.17 13.89,12.72 13.33,12.72C12.77,12.72 12.32,13.17 12.32,13.73C12.32,14.29 12.77,14.74 13.33,14.74C13.89,14.74 14.34,14.29 14.34,13.73M9.92,11.93C9.92,11.22 9.34,10.64 8.63,10.64C7.92,10.64 7.34,11.22 7.34,11.93C7.34,12.64 7.92,13.22 8.63,13.22C9.34,13.22 9.92,12.64 9.92,11.93Z" />
              </svg>
              
              {/* Floating elements around brain */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-200 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute top-0 -left-2 w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">DSA Learning Path</h2>
          </div>
          <p className="text-light-100 text-lg sm:text-xl max-w-3xl mx-auto text-center">
            🎯 Core DSA Learning Path (Indian-style) - Your complete roadmap to master Data Structures & Algorithms
          </p>
          <div className="flex flex-wrap items-center justify-center mt-4 space-x-3 sm:space-x-6 text-sm text-light-400">
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Structured Learning
            </div>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              FAANG Ready
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Free Resources
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-dark-200 rounded-lg p-1 overflow-x-auto">
            {[
              { id: 'roadmap', label: 'Roadmaps', icon: FileText },
              { id: 'youtube', label: 'YouTube', icon: Youtube },
              { id: 'platforms', label: 'Platforms', icon: Code },
              { id: 'bonus', label: 'Bonus', icon: BookOpen },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setActiveTab(id as any);
                    setIsLoading(false);
                  }, 150);
                }}
                className={`flex items-center px-4 md:px-6 py-3 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-primary-200 text-dark-100 transform scale-105'
                    : 'text-light-100 hover:text-white hover:bg-dark-300'
                }`}
              >
                <Icon className="mr-2" size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
          >
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">📚 Step-by-Step Roadmap (Free + Structured)</h3>
                <p className="text-light-100">Curated learning paths from top educators in India</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {learningPaths.map((resource, index) => renderResourceCard(resource, index))}
              </div>

              {/* Quick Start Guide */}
              <div className="card-border mt-12">
                <div className="card p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <Target className="mr-2 text-primary-200" />
                    🚀 Quick Start Guide
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-200/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary-200 font-bold">1</span>
                      </div>
                      <h5 className="font-semibold mb-2">Choose Your Path</h5>
                      <p className="text-sm text-light-100">Start with Striver's A2Z Sheet for beginners</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-200/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary-200 font-bold">2</span>
                      </div>
                      <h5 className="font-semibold mb-2">Practice Daily</h5>
                      <p className="text-sm text-light-100">Solve 2-3 problems daily consistently</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-200/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary-200 font-bold">3</span>
                      </div>
                      <h5 className="font-semibold mb-2">Track Progress</h5>
                      <p className="text-sm text-light-100">Use platforms like Leetcode to monitor growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'youtube' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">💡 YouTube Channels (Indian Teaching Style)</h3>
                <p className="text-light-100">Learn from the best educators who explain in simple Hindi/English</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {youtubeChannels.map((channel, index) => renderYouTubeCard(channel, index))}
              </div>
            </div>
          )}

          {activeTab === 'platforms' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">🧠 Platform-Based Practice (Free + Targeted)</h3>
                <p className="text-light-100">Practice on these platforms to build your coding skills</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {platforms.map((platform, index) => renderPlatformCard(platform, index))}
              </div>
            </div>
          )}

          {activeTab === 'bonus' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">📘 Bonus: Theory & Explanation Resources</h3>
                <p className="text-light-100">Deep dive resources for comprehensive understanding</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bonusResources.map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className={`card-border group cursor-pointer ${resource.isRecommended ? 'ring-2 ring-primary-200' : ''}`}
                  >
                    {resource.isRecommended && (
                      <div className="absolute -top-2 -right-2 bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        RECOMMENDED
                      </div>
                    )}
                    
                    <div className="card p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          {resource.type === 'theory' ? 
                            <Brain className="w-6 h-6 text-purple-500" /> : 
                            <BookOpen className="w-6 h-6 text-purple-500" />
                          }
                        </div>
                        <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                      </div>
                      
                      <p className="text-light-100 mb-4 text-sm leading-relaxed">{resource.description}</p>
                      
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-500 hover:text-purple-400 transition-all duration-200 text-sm font-medium group-hover:translate-x-1"
                      >
                        Access Resource
                        <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Success Tips */}
              <div className="card-border mt-8">
                <div className="card p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <Trophy className="mr-2 text-primary-200" />
                    💡 Success Tips
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-2 text-primary-200">Time Management</h5>
                      <ul className="space-y-1 text-sm text-light-100">
                        <li>• 40% DSA Practice</li>
                        <li>• 35% Development Skills</li>
                        <li>• 25% Building Projects</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2 text-primary-200">Study Strategy</h5>
                      <ul className="space-y-1 text-sm text-light-100">
                        <li>• Focus on patterns, not memorization</li>
                        <li>• Solve problems from easy to hard</li>
                        <li>• Review and revise weekly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
