'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Youtube, 
  ExternalLink, 
  BookOpen, 
  BarChart3, 
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
  TrendingUp,
  Cpu,
  PieChart,
  Activity,
  Server,
  Code2,
  Target,
  LineChart,
  GitBranch,
  Layers
} from 'lucide-react';

interface Phase {
  name: string;
  topics: string[];
  duration: string;
  icon: React.ElementType;
  color: string;
  emoji: string;
}

interface YouTubeChannel {
  name: string;
  creator: string;
  strength: string;
  language: string;
  url: string;
  isRecommended?: boolean;
}

interface Library {
  area: string;
  libraries: string[];
  docs: string;
  url: string;
  isEssential?: boolean;
  icon: React.ElementType;
  color: string;
}

interface Project {
  title: string;
  description: string;
  concepts: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ElementType;
  category: string;
}

interface Tool {
  name: string;
  purpose: string;
  url: string;
  category: string;
  isFree: boolean;
  isRecommended?: boolean;
}

const phases: Phase[] = [
  {
    name: "Python Foundation",
    topics: ["Syntax", "Loops & Conditions", "OOP", "NumPy", "Pandas"],
    duration: "2-3 weeks",
    icon: Code2,
    color: "blue",
    emoji: "🐍"
  },
  {
    name: "Data Science",
    topics: ["EDA", "Data Cleaning", "Visualization", "Statistics Basics"],
    duration: "2-3 weeks",
    icon: BarChart3,
    color: "green",
    emoji: "📊"
  },
  {
    name: "ML Core",
    topics: ["Supervised Learning", "Unsupervised Learning", "Metrics", "Model Tuning"],
    duration: "3-4 weeks",
    icon: Brain,
    color: "purple",
    emoji: "🧠"
  },
  {
    name: "ML Projects",
    topics: ["Regression Projects", "Classification", "Clustering", "Time Series"],
    duration: "3-4 weeks",
    icon: TrendingUp,
    color: "orange",
    emoji: "📈"
  },
  {
    name: "Deep Learning/AI",
    topics: ["Neural Networks", "CNNs", "RNNs", "Transformers (Optional)"],
    duration: "2-4 weeks",
    icon: Cpu,
    color: "red",
    emoji: "🔍"
  },
  {
    name: "Backend APIs",
    topics: ["Flask APIs", "Django", "Model Deployment", "Web UI"],
    duration: "2 weeks",
    icon: Server,
    color: "indigo",
    emoji: "🌐"
  },
  {
    name: "Deployment",
    topics: ["Render/Heroku", "Vercel", "Docker Basics", "MLOps"],
    duration: "1 week",
    icon: Globe,
    color: "pink",
    emoji: "🚀"
  }
];

const youtubeChannels: YouTubeChannel[] = [
  {
    name: "Krish Naik",
    creator: "Krish Naik",
    strength: "Real-world ML, Flask APIs, job-focused ML",
    language: "Hindi/English",
    url: "https://www.youtube.com/@krishnaik06",
    isRecommended: true
  },
  {
    name: "Codebasics",
    creator: "Dhaval Patel",
    strength: "ML projects + Pandas + Excel for ML",
    language: "Hindi/English",
    url: "https://www.youtube.com/@codebasics",
    isRecommended: true
  },
  {
    name: "StatQuest",
    creator: "Josh Starmer",
    strength: "Concepts like Decision Trees, PCA, Statistics",
    language: "English",
    url: "https://www.youtube.com/@statquest"
  },
  {
    name: "CampusX",
    creator: "Nitish Singh",
    strength: "ML/DL with theory and practical code",
    language: "Hindi",
    url: "https://www.youtube.com/@campusx-official",
    isRecommended: true
  },
  {
    name: "PW Skills",
    creator: "Physics Wallah",
    strength: "End-to-end Data Science in Hindi series",
    language: "Hindi/English",
    url: "https://www.youtube.com/@PWSkills"
  },
  {
    name: "Amigoscode",
    creator: "Nelson Djalo",
    strength: "Django, backend, clean Python coding",
    language: "English",
    url: "https://www.youtube.com/@amigoscode"
  }
];

const libraries: Library[] = [
  {
    area: "Data Science",
    libraries: ["numpy", "pandas", "matplotlib", "seaborn"],
    docs: "Pandas Documentation",
    url: "https://pandas.pydata.org/docs/",
    isEssential: true,
    icon: BarChart3,
    color: "blue"
  },
  {
    area: "Machine Learning",
    libraries: ["scikit-learn", "xgboost", "lightgbm"],
    docs: "Scikit-learn Documentation",
    url: "https://scikit-learn.org/stable/",
    isEssential: true,
    icon: Brain,
    color: "purple"
  },
  {
    area: "Deep Learning",
    libraries: ["tensorflow", "keras", "pytorch"],
    docs: "Keras Documentation",
    url: "https://keras.io/",
    isEssential: true,
    icon: Cpu,
    color: "red"
  },
  {
    area: "Web Deployment",
    libraries: ["Flask", "Django", "FastAPI"],
    docs: "Flask & Django Docs",
    url: "https://flask.palletsprojects.com/",
    isEssential: true,
    icon: Server,
    color: "green"
  },
  {
    area: "Statistics",
    libraries: ["statsmodels", "scipy"],
    docs: "StatsModels Documentation",
    url: "https://www.statsmodels.org/stable/",
    icon: LineChart,
    color: "orange"
  },
  {
    area: "Visualization",
    libraries: ["plotly", "bokeh", "streamlit"],
    docs: "Plotly Documentation",
    url: "https://plotly.com/python/",
    icon: PieChart,
    color: "indigo"
  }
];

const projects: Project[] = [
  {
    title: "House Price Prediction",
    description: "Regression model to predict house prices using real estate data",
    concepts: ["Linear Regression", "Feature Engineering", "Data Cleaning", "Model Evaluation"],
    difficulty: "Beginner",
    icon: TrendingUp,
    category: "Regression"
  },
  {
    title: "Customer Churn Analysis",
    description: "Classification model to predict customer churn for telecom",
    concepts: ["Classification", "EDA", "Logistic Regression", "Random Forest"],
    difficulty: "Intermediate",
    icon: Users,
    category: "Classification"
  },
  {
    title: "Movie Recommendation System",
    description: "Build a recommendation engine using collaborative filtering",
    concepts: ["Unsupervised Learning", "Clustering", "Similarity Metrics", "Matrix Factorization"],
    difficulty: "Intermediate",
    icon: Target,
    category: "Recommendation"
  },
  {
    title: "Stock Price Forecasting",
    description: "Time series analysis and prediction using LSTM networks",
    concepts: ["Time Series", "LSTM", "Deep Learning", "Technical Indicators"],
    difficulty: "Advanced",
    icon: LineChart,
    category: "Time Series"
  },
  {
    title: "Image Classification App",
    description: "CNN model deployed as web app for image recognition",
    concepts: ["CNN", "Transfer Learning", "Flask/Streamlit", "Model Deployment"],
    difficulty: "Advanced",
    icon: Brain,
    category: "Computer Vision"
  },
  {
    title: "Sentiment Analysis API",
    description: "NLP model deployed as REST API for text sentiment analysis",
    concepts: ["NLP", "Text Processing", "Flask API", "Model Serving"],
    difficulty: "Intermediate",
    icon: Activity,
    category: "NLP"
  }
];

const tools: Tool[] = [
  {
    name: "Jupyter Notebook",
    purpose: "Interactive data science environment",
    url: "https://jupyter.org/",
    category: "Development",
    isFree: true,
    isRecommended: true
  },
  {
    name: "Google Colab",
    purpose: "Free GPU/TPU for ML training",
    url: "https://colab.research.google.com/",
    category: "Development",
    isFree: true,
    isRecommended: true
  },
  {
    name: "Kaggle",
    purpose: "Datasets, competitions, and free notebooks",
    url: "https://www.kaggle.com/",
    category: "Data & Practice",
    isFree: true,
    isRecommended: true
  },
  {
    name: "Streamlit",
    purpose: "Quick ML web app deployment",
    url: "https://streamlit.io/",
    category: "Deployment",
    isFree: true,
    isRecommended: true
  },
  {
    name: "Render",
    purpose: "Free ML model deployment",
    url: "https://render.com/",
    category: "Deployment",
    isFree: true
  },
  {
    name: "MLflow",
    purpose: "ML experiment tracking and model management",
    url: "https://mlflow.org/",
    category: "MLOps",
    isFree: true
  }
];

export default function MLPythonLearningPath() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'youtube' | 'libraries' | 'projects' | 'tools' | 'concepts'>('roadmap');
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
      indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-500', border: 'border-indigo-500/50' },
      pink: { bg: 'bg-pink-500/20', text: 'text-pink-500', border: 'border-pink-500/50' }
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
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <span className="mr-2">{phase.emoji}</span>
                  {phase.name}
                </h3>
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
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded mt-1 inline-block">
                {channel.language}
              </span>
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

  const renderLibraryCard = (library: Library, index: number) => {
    const colors = getColorClasses(library.color);
    const Icon = library.icon;
    
    return (
      <motion.div
        key={library.area}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className={`card-border group cursor-pointer ${library.isEssential ? 'ring-2 ring-primary-200' : ''}`}
      >
        {library.isEssential && (
          <div className="absolute -top-2 -right-2 bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            ESSENTIAL
          </div>
        )}
        
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${colors.bg} rounded-lg`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{library.area}</h3>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">Libraries:</h4>
            <div className="flex flex-wrap gap-1">
              {library.libraries.map((lib, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded`}
                >
                  {lib}
                </span>
              ))}
            </div>
          </div>
          
          <a
            href={library.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center ${colors.text} hover:opacity-80 transition-all duration-200 text-sm font-medium group-hover:translate-x-1`}
          >
            {library.docs}
            <ExternalLink className="w-4 h-4 ml-1 group-hover:animate-pulse" />
          </a>
        </div>
      </motion.div>
    );
  };

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
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {project.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-light-100 mb-4 text-sm leading-relaxed">{project.description}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">Key Concepts:</h4>
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
              <Terminal className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tool.isFree ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {tool.isFree ? 'Free' : 'Paid'}
                </span>
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                  {tool.category}
                </span>
              </div>
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
              {/* Animated Brain + Data SVG */}
              <svg className="w-8 h-8 text-primary-200 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7.29C13.89,7.63 14.63,8.17 15.2,8.84C15.77,8.17 16.51,7.63 17.4,7.29V5.73C16.4,5.39 16,4.74 16,4A2,2 0 0,1 18,2A2,2 0 0,1 20,4C20,5.16 19.16,6.09 18.09,6.29C18.03,6.5 18,6.72 18,6.95C18,7.84 18.25,8.66 18.68,9.38L20.63,7.43C20.85,7.21 21.19,7.21 21.41,7.43C21.63,7.65 21.63,7.99 21.41,8.21L19.46,10.16C19.77,10.84 20,11.6 20,12.42C20,13.84 19.5,15.14 18.68,16.16L20.63,18.11C20.85,18.33 20.85,18.67 20.63,18.89C20.41,19.11 20.07,19.11 19.85,18.89L17.9,16.94C16.88,17.76 15.58,18.26 14.16,18.26C13.34,18.26 12.58,18.03 11.9,17.72L13.85,15.77C13.63,15.55 13.63,15.21 13.85,14.99C14.07,14.77 14.41,14.77 14.63,14.99L16.58,16.94C17.4,16.12 17.9,14.82 17.9,13.4C17.9,12.58 17.67,11.82 17.36,11.14L15.41,13.09C15.19,13.31 14.85,13.31 14.63,13.09C14.41,12.87 14.41,12.53 14.63,12.31L16.58,10.36C15.76,9.54 14.46,9.04 13.04,9.04C12.22,9.04 11.46,9.27 10.78,9.58L12.73,11.53C12.95,11.75 12.95,12.09 12.73,12.31C12.51,12.53 12.17,12.53 11.95,12.31L10,10.36C9.18,11.18 8.68,12.48 8.68,13.9C8.68,14.72 8.91,15.48 9.22,16.16L11.17,14.21C11.39,13.99 11.73,13.99 11.95,14.21C12.17,14.43 12.17,14.77 11.95,14.99L10,16.94C10.88,17.76 12.18,18.26 13.6,18.26C14.42,18.26 15.18,18.03 15.86,17.72L13.91,15.77C13.69,15.55 13.69,15.21 13.91,14.99C14.13,14.77 14.47,14.77 14.69,14.99L16.64,16.94C17.46,16.12 17.96,14.82 17.96,13.4C17.96,12.18 17.46,11.08 16.64,10.26L14.69,12.21C14.47,12.43 14.13,12.43 13.91,12.21C13.69,11.99 13.69,11.65 13.91,11.43L15.86,9.48C15.18,8.97 14.42,8.74 13.6,8.74C12.18,8.74 10.88,9.24 10,10.06V11.29C10.89,11.63 11.63,12.17 12.2,12.84C12.77,12.17 13.51,11.63 14.4,11.29V9.73C13.4,9.39 13,8.74 13,8A2,2 0 0,1 11,6A2,2 0 0,1 13,4Z"/>
              </svg>
              
              {/* Floating elements */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute top-0 -left-2 w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">ML + Python Backend Path</h2>
          </div>
          <p className="text-light-100 text-lg sm:text-xl max-w-3xl mx-auto text-center">
            🧠📊 Machine Learning + Data Science + Python (with Flask & Django)
          </p>
          <div className="flex flex-wrap items-center justify-center mt-4 space-x-3 sm:space-x-6 text-sm text-light-400">
            <div className="flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              AI/ML Ready
            </div>
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              Data Science
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Industry Projects
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-dark-200 rounded-lg p-1 overflow-x-auto">
            {[
              { id: 'roadmap', label: 'Roadmap', icon: Layers },
              { id: 'youtube', label: 'YouTube', icon: Youtube },
              { id: 'libraries', label: 'Libraries', icon: BookOpen },
              { id: 'projects', label: 'Projects', icon: Target },
              { id: 'tools', label: 'Tools', icon: Terminal },
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
                  <h3 className="text-2xl font-bold mb-2">🗺️ Roadmap Overview (Beginner to Advanced)</h3>
                  <p className="text-light-100">Complete ML journey from Python basics to deployment</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {phases.map((phase, index) => renderPhaseCard(phase, index))}
                </div>

                {/* Learning Timeline */}
                <div className="card-border mt-12">
                  <div className="card p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Calendar className="mr-2 text-primary-200" />
                      📊 ML Learning Stats
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-4 bg-dark-200/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-200 mb-1">15-20</div>
                        <div className="text-light-100">Total Weeks</div>
                      </div>
                      <div className="text-center p-4 bg-dark-200/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400 mb-1">3-4</div>
                        <div className="text-light-100">Hours/Day</div>
                      </div>
                      <div className="text-center p-4 bg-dark-200/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400 mb-1">8+</div>
                        <div className="text-light-100">ML Projects</div>
                      </div>
                      <div className="text-center p-4 bg-dark-200/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400 mb-1">5+</div>
                        <div className="text-light-100">Deployments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'youtube' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">📺 Top Indian-Style YouTube Channels (ML + Python)</h3>
                  <p className="text-light-100">Learn from experienced ML practitioners in Hindi/English</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {youtubeChannels.map((channel, index) => renderYouTubeCard(channel, index))}
                </div>
              </div>
            )}

            {activeTab === 'libraries' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">📚 Must-Know Libraries & Official Docs</h3>
                  <p className="text-light-100">Essential Python libraries for ML and data science</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {libraries.map((library, index) => renderLibraryCard(library, index))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">🚀 ML Project Portfolio (Real-World Focus)</h3>
                  <p className="text-light-100">Build end-to-end projects that showcase your ML skills</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => renderProjectCard(project, index))}
                </div>

                {/* Project Learning Path */}
                <div className="card-border mt-12">
                  <div className="card p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Target className="mr-2 text-primary-200" />
                      📈 Project Progression Strategy
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-green-400 font-bold">1-2</span>
                        </div>
                        <h5 className="font-semibold mb-2 text-green-400">Beginner Projects</h5>
                        <p className="text-sm text-light-100">Simple regression/classification</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-yellow-400 font-bold">3-4</span>
                        </div>
                        <h5 className="font-semibold mb-2 text-yellow-400">Intermediate Projects</h5>
                        <p className="text-sm text-light-100">Feature engineering, deployment</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-red-400 font-bold">5+</span>
                        </div>
                        <h5 className="font-semibold mb-2 text-red-400">Advanced Projects</h5>
                        <p className="text-sm text-light-100">Deep learning, production apps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">🛠️ Essential ML & Python Tools</h3>
                  <p className="text-light-100">Development environment and deployment tools</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool, index) => renderToolCard(tool, index))}
                </div>

                {/* Tool Categories */}
                <div className="card-border mt-12">
                  <div className="card p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Zap className="mr-2 text-primary-200" />
                      🔧 Tool Usage Guide
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold mb-2 text-primary-200">Development Flow</h5>
                        <ul className="space-y-1 text-sm text-light-100">
                          <li>• Start with Jupyter/Colab for experimentation</li>
                          <li>• Use Kaggle for datasets and competitions</li>
                          <li>• Build web apps with Streamlit/Flask</li>
                          <li>• Track experiments with MLflow</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2 text-primary-200">Deployment Strategy</h5>
                        <ul className="space-y-1 text-sm text-light-100">
                          <li>• Quick prototypes: Streamlit Cloud</li>
                          <li>• API services: Render/Heroku</li>
                          <li>• Production: Docker + cloud services</li>
                          <li>• Model serving: MLflow + FastAPI</li>
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
