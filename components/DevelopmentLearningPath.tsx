'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Youtube, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  Database,
  Globe,
  Calendar,
  Clock,
  Star,
  Users,
  ChevronRight,
  PlayCircle,
  FileText,
  Award,
  Zap,
  Terminal,
  Smartphone,
  Server,
  Box,
  Settings,
  User,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  Upload,
  Brain
} from 'lucide-react';

interface Phase {
  name: string;
  topics: string[];
  duration: string;
  icon: React.ElementType;
  color: string;
}

interface YouTubeChannel {
  name: string;
  creator: string;
  strength: string;
  url: string;
  isRecommended?: boolean;
}

interface Documentation {
  tech: string;
  description: string;
  url: string;
  isEssential?: boolean;
}

interface Concept {
  topic: string;
  resource: string;
  url: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface Tool {
  name: string;
  purpose: string;
  url: string;
  isFree: boolean;
  isRecommended?: boolean;
}

interface Project {
  title: string;
  description: string;
  concepts: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ElementType;
}

const phases: Phase[] = [
  {
    name: "Foundation",
    topics: ["HTML", "CSS", "JavaScript", "Git", "Terminal"],
    duration: "2 weeks",
    icon: Layers,
    color: "blue"
  },
  {
    name: "Frontend",
    topics: ["React.js", "Next.js", "Tailwind CSS", "UI Libraries"],
    duration: "4 weeks",
    icon: Smartphone,
    color: "green"
  },
  {
    name: "Backend",
    topics: ["Node.js", "Express.js", "REST APIs", "Authentication"],
    duration: "3 weeks",
    icon: Server,
    color: "purple"
  },
  {
    name: "Database",
    topics: ["MongoDB (NoSQL)", "PostgreSQL (SQL)", "Prisma ORM"],
    duration: "2 weeks",
    icon: Database,
    color: "orange"
  },
  {
    name: "Advanced",
    topics: ["State Management", "WebSockets", "Docker", "Testing"],
    duration: "2-3 weeks",
    icon: Settings,
    color: "red"
  },
  {
    name: "Projects",
    topics: ["Full-stack Apps", "Authentication", "Database Integration", "Deployment"],
    duration: "Ongoing",
    icon: Box,
    color: "indigo"
  }
];

const youtubeChannels: YouTubeChannel[] = [
  {
    name: "Chai aur Code",
    creator: "Anurag",
    strength: "Clean React, auth, backend, SaaS apps",
    url: "https://www.youtube.com/@chaiaurcode",
    isRecommended: true
  },
  {
    name: "Thapa Technical",
    creator: "Vinod Thapa",
    strength: "Full MERN stack explained in Hindi",
    url: "https://www.youtube.com/@thapatechnical"
  },
  {
    name: "Code with Harry",
    creator: "Haris Khan",
    strength: "Hindi-based Dev + Python + DBs",
    url: "https://www.youtube.com/@CodeWithHarry"
  },
  {
    name: "Akshay Saini",
    creator: "Akshay Saini",
    strength: "JS deep dives (closures, hoisting, async)",
    url: "https://www.youtube.com/@akshaymarch7",
    isRecommended: true
  },
  {
    name: "Hitesh Choudhary (LCO)",
    creator: "Hitesh Choudhary",
    strength: "Full-stack, system design, LLD concepts",
    url: "https://www.youtube.com/@HiteshChoudharydotcom"
  }
];

const documentation: Documentation[] = [
  {
    tech: "JavaScript",
    description: "Complete JavaScript guide with examples",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    isEssential: true
  },
  {
    tech: "React.js",
    description: "Official React documentation and tutorials",
    url: "https://react.dev/",
    isEssential: true
  },
  {
    tech: "Node.js",
    description: "Official Node.js documentation",
    url: "https://nodejs.org/en/docs/",
    isEssential: true
  },
  {
    tech: "Express.js",
    description: "Fast, unopinionated web framework for Node.js",
    url: "https://expressjs.com/"
  },
  {
    tech: "MongoDB",
    description: "NoSQL database documentation",
    url: "https://docs.mongodb.com/"
  },
  {
    tech: "PostgreSQL",
    description: "Advanced SQL database documentation",
    url: "https://www.postgresql.org/docs/"
  },
  {
    tech: "Prisma ORM",
    description: "Next-generation Node.js and TypeScript ORM",
    url: "https://www.prisma.io/docs/"
  }
];

const concepts: Concept[] = [
  {
    topic: "JS Engine Internals",
    resource: "How JavaScript Works",
    url: "https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf",
    difficulty: "Advanced"
  },
  {
    topic: "React Fiber",
    resource: "React Fiber Architecture",
    url: "https://github.com/acdlite/react-fiber-architecture",
    difficulty: "Advanced"
  },
  {
    topic: "Event Loop & Async",
    resource: "What the heck is the event loop?",
    url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
    difficulty: "Intermediate"
  },
  {
    topic: "REST vs GraphQL",
    resource: "A comparative study on REST and GraphQL",
    url: "https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/",
    difficulty: "Intermediate"
  },
  {
    topic: "Database Indexing",
    resource: "Use The Index, Luke!",
    url: "https://use-the-index-luke.com/",
    difficulty: "Intermediate"
  },
  {
    topic: "JWT vs Session Auth",
    resource: "Auth0 Authentication Guide",
    url: "https://auth0.com/learn/json-web-tokens/",
    difficulty: "Beginner"
  }
];

const tools: Tool[] = [
  {
    name: "VS Code",
    purpose: "Primary IDE for development",
    url: "https://code.visualstudio.com/",
    isFree: true,
    isRecommended: true
  },
  {
    name: "Postman",
    purpose: "API testing and development",
    url: "https://www.postman.com/",
    isFree: true,
    isRecommended: true
  },
  {
    name: "MongoDB Atlas",
    purpose: "Free cloud database hosting",
    url: "https://www.mongodb.com/cloud/atlas",
    isFree: true
  },
  {
    name: "Railway",
    purpose: "Free full-stack deployment",
    url: "https://railway.app/",
    isFree: true
  },
  {
    name: "Vercel",
    purpose: "Frontend deployment platform",
    url: "https://vercel.com/",
    isFree: true,
    isRecommended: true
  },
  {
    name: "GitHub",
    purpose: "Version control and collaboration",
    url: "https://github.com/",
    isFree: true,
    isRecommended: true
  }
];

const projects: Project[] = [
  {
    title: "Auth + Dashboard",
    description: "User authentication system with protected dashboard",
    concepts: ["JWT", "Database", "Protected Routes", "Sessions"],
    difficulty: "Beginner",
    icon: User
  },
  {
    title: "E-commerce Store",
    description: "Full-featured online store with cart and payments",
    concepts: ["Cart Management", "Filters", "REST API", "Payment Integration"],
    difficulty: "Intermediate",
    icon: ShoppingCart
  },
  {
    title: "Chat App (Socket.io)",
    description: "Real-time messaging application",
    concepts: ["WebSockets", "Live Updates", "User Presence"],
    difficulty: "Intermediate",
    icon: MessageCircle
  },
  {
    title: "SaaS Admin Panel",
    description: "Dashboard with analytics and user management",
    concepts: ["Charts", "Filtering", "Database CRUD", "User Roles"],
    difficulty: "Advanced",
    icon: BarChart3
  },
  {
    title: "File Upload + Previewer",
    description: "File handling with cloud storage integration",
    concepts: ["Multer", "Cloudinary", "Client Preview", "File Validation"],
    difficulty: "Intermediate",
    icon: Upload
  },
  {
    title: "AI Tools (Notes / Resume)",
    description: "AI-powered productivity applications",
    concepts: ["OpenAI API", "Frontend Integration", "Data Processing"],
    difficulty: "Advanced",
    icon: Brain
  }
];

export default function DevelopmentLearningPath() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'youtube' | 'docs' | 'concepts' | 'tools' | 'projects'>('roadmap');
  const [isLoading, setIsLoading] = useState(false);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/50' },
      green: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500/50' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-500', border: 'border-purple-500/50' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/50' },
      red: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/50' },
      indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-500', border: 'border-indigo-500/50' }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const renderPhaseCard = (phase: Phase, index: number) => {
    const colors = getColorClasses(phase.color);
    const Icon = phase.icon;
    
    return (
      <motion.div
        key={phase.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className={`card-border border-l-4 ${colors.border} group cursor-pointer`}
      >
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${colors.bg} rounded-lg`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{phase.name}</h3>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-light-400 mr-1" />
                  <span className="text-sm text-light-400">{phase.duration}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Topics:</h4>
            <div className="flex flex-wrap gap-2">
              {phase.topics.map((topic, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

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
            </div>
          </div>
        </div>
        
        <p className="text-light-100 mb-4 text-sm">{channel.strength}</p>
        
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

  const renderDocCard = (doc: Documentation, index: number) => (
    <motion.div
      key={doc.tech}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`card-border group cursor-pointer ${doc.isEssential ? 'ring-2 ring-primary-200' : ''}`}
    >
      {doc.isEssential && (
        <div className="absolute -top-2 -right-2 bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="w-3 h-3 mr-1" />
          ESSENTIAL
        </div>
      )}
      
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{doc.tech}</h3>
            </div>
          </div>
        </div>
        
        <p className="text-light-100 mb-4 text-sm leading-relaxed">{doc.description}</p>
        
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-all duration-200 text-sm font-medium group-hover:translate-x-1"
        >
          Read Documentation
          <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
        </a>
      </div>
    </motion.div>
  );

  const renderConceptCard = (concept: Concept, index: number) => (
    <motion.div
      key={concept.topic}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="card-border group cursor-pointer"
    >
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{concept.topic}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                concept.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                concept.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {concept.difficulty}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-light-100 mb-4 text-sm">{concept.resource}</p>
        
        <a
          href={concept.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-purple-500 hover:text-purple-400 transition-all duration-200 text-sm font-medium group-hover:translate-x-1"
        >
          Learn More
          <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
        </a>
      </div>
    </motion.div>
  );

  const renderToolCard = (tool: Tool, index: number) => (
    <motion.div
      key={tool.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`card-border group cursor-pointer ${tool.isRecommended ? 'ring-2 ring-primary-200' : ''}`}
    >
      {tool.isRecommended && (
        <div className="absolute -top-2 -right-2 bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="w-3 h-3 mr-1" />
          RECOMMENDED
        </div>
      )}
      
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Settings className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                tool.isFree ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {tool.isFree ? 'Free' : 'Paid'}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-light-100 mb-4 text-sm">{tool.purpose}</p>
        
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-green-500 hover:text-green-400 transition-all duration-200 text-sm font-medium group-hover:translate-x-1"
        >
          Visit Tool
          <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
        </a>
      </div>
    </motion.div>
  );

  const renderProjectCard = (project: Project, index: number) => {
    const Icon = project.icon;
    
    return (
      <motion.div
        key={project.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="card-border group cursor-pointer"
      >
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {project.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-light-100 mb-4 text-sm leading-relaxed">{project.description}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-1">
              {project.concepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

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
              {/* Animated Code SVG */}
              <svg className="w-8 h-8 text-primary-200 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z" />
              </svg>
              
              {/* Floating elements */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute top-0 -left-2 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">Development Learning Path</h2>
          </div>
          <p className="text-light-100 text-lg sm:text-xl max-w-3xl mx-auto text-center">
            🚀 Full-Stack Development Roadmap (Indian Style - Minimal Platform, Max Knowledge)
          </p>
          <div className="flex flex-wrap items-center justify-center mt-4 space-x-3 sm:space-x-6 text-sm text-light-400">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Practical Learning
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Full-Stack Ready
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Industry Standard
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-dark-200 rounded-lg p-1 overflow-x-auto">
            {[
              { id: 'roadmap', label: 'Roadmap', icon: Layers },
              { id: 'youtube', label: 'YouTube', icon: Youtube },
              { id: 'docs', label: 'Docs', icon: BookOpen },
              { id: 'concepts', label: 'Concepts', icon: Brain },
              { id: 'tools', label: 'Tools', icon: Settings },
              { id: 'projects', label: 'Projects', icon: Box },
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
                className={`flex items-center px-3 md:px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
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
                  <h3 className="text-2xl font-bold mb-2">🗺️ Overall Structure (Beginner to Advanced)</h3>
                  <p className="text-light-100">Complete learning path from foundation to deployment</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {phases.map((phase, index) => renderPhaseCard(phase, index))}
                </div>

                {/* Learning Timeline */}
                <div className="card-border mt-12">
                  <div className="card p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Calendar className="mr-2 text-primary-200" />
                      📅 Learning Timeline
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-4 bg-dark-200/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-200 mb-1">13-15</div>
                        <div className="text-light-100">Total Weeks</div>
                      </div>
                      <div className="text-center p-4 bg-dark-200/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400 mb-1">2-3</div>
                        <div className="text-light-100">Hours/Day</div>
                      </div>
                      <div className="text-center p-4 bg-dark-200/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400 mb-1">6+</div>
                        <div className="text-light-100">Projects</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'youtube' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">🎥 Top YouTube Channels (Indian Dev + Real Projects)</h3>
                  <p className="text-light-100">Learn from experienced developers building real applications</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {youtubeChannels.map((channel, index) => renderYouTubeCard(channel, index))}
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">📘 Core Official Docs to Bookmark</h3>
                  <p className="text-light-100">Essential documentation for every full-stack developer</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documentation.map((doc, index) => renderDocCard(doc, index))}
                </div>
              </div>
            )}

            {activeTab === 'concepts' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">📄 Must-Read Papers / Concepts for Serious Devs</h3>
                  <p className="text-light-100">Deep dive into advanced concepts and architectural patterns</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {concepts.map((concept, index) => renderConceptCard(concept, index))}
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">🛠️ Minimal Platforms / Tools (Just These)</h3>
                  <p className="text-light-100">Essential tools for efficient development workflow</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool, index) => renderToolCard(tool, index))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">💡 Suggested Projects (Real-World Focus)</h3>
                  <p className="text-light-100">Build portfolio projects that demonstrate your skills</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => renderProjectCard(project, index))}
                </div>

                {/* Project Success Tips */}
                <div className="card-border mt-12">
                  <div className="card p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Zap className="mr-2 text-primary-200" />
                      🎯 Project Success Tips
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold mb-2 text-primary-200">Development Process</h5>
                        <ul className="space-y-1 text-sm text-light-100">
                          <li>• Start with wireframes and planning</li>
                          <li>• Build MVP first, then add features</li>
                          <li>• Focus on user experience</li>
                          <li>• Write clean, documented code</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2 text-primary-200">Deployment & Portfolio</h5>
                        <ul className="space-y-1 text-sm text-light-100">
                          <li>• Deploy early and often</li>
                          <li>• Add projects to GitHub</li>
                          <li>• Write detailed README files</li>
                          <li>• Include live demo links</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
