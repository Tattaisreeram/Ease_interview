'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, MessageCircle, BarChart3, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";

interface ResumeAnalysis {
  overallScore: number;
  sections: {
    experience: { score: number; feedback: string };
    skills: { score: number; feedback: string };
    education: { score: number; feedback: string };
    projects: { score: number; feedback: string };
    formatting: { score: number; feedback: string };
  };
  strengths: string[];
  weaknesses: string[];
  keywordAnalysis: {
    present: string[];
    missing: string[];
    relevanceScore: number;
  };
  nextSteps: {
    projects: string[];
    dsaBalance: {
      currentLevel: string;
      recommendation: string;
      suggestedTopics: string[];
    };
    developmentSkills: {
      currentLevel: string;
      recommendation: string;
      suggestedSkills: string[];
    };
    timeAllocation: {
      dsa: number;
      development: number;
      projects: number;
    };
  };
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'chat'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!allowedTypes.includes(uploadedFile.type)) {
      alert('Please upload a DOCX, DOC, or TXT file. PDF support is temporarily unavailable.');
      return;
    }

    setFile(uploadedFile);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/resume/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from file');
      }

      const data = await response.json();
      setExtractedText(data.text);
      setActiveTab('analysis');
    } catch (error) {
      console.error('Error extracting text:', error);
      alert(`Error extracting text from file: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!extractedText) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText: extractedText, targetRole: 'Software Developer' }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Error analyzing resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !extractedText) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/resume/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          resumeText: extractedText,
          analysisData: analysis,
          chatHistory: chatMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const ScoreBar = ({ score, max = 100 }: { score: number; max?: number }) => (
    <div className="w-full bg-dark-300 rounded-full h-2">
      <div
        className="bg-primary-200 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(score / max) * 100}%` }}
      />
    </div>
  );

  const renderUploadTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-3">Upload Your Resume</h3>
        <p className="text-light-100 mb-6">
          Upload your resume in DOCX, DOC, or TXT format for comprehensive analysis
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div
          className="border-2 border-dashed border-light-600 rounded-lg p-6 text-center hover:border-primary-200 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto mb-3 text-light-400" size={40} />
          <p className="text-light-100 mb-2">
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-light-400">
            DOCX, DOC, TXT (Max 10MB)
          </p>
          <p className="text-xs text-destructive-100 mt-2">
            PDF support temporarily unavailable
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.doc,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-200"></div>
            <p className="mt-2 text-light-100">Extracting text from file...</p>
          </div>
        )}

        {extractedText && (
          <div className="mt-4 p-4 bg-dark-200 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <FileText className="mr-2" size={18} />
              Text Extracted Successfully
            </h4>
            <div className="max-h-32 overflow-y-auto text-sm text-light-100">
              {extractedText.substring(0, 300)}...
            </div>
            <button
              onClick={() => setActiveTab('analysis')}
              className="mt-3 btn-primary"
            >
              Proceed to Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-3">Resume Analysis</h3>
        {!analysis && (
          <button
            onClick={analyzeResume}
            disabled={isAnalyzing || !extractedText}
            className="btn-primary"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        )}
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card-border">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">Overall Score</h4>
                <span className="text-xl font-bold text-primary-200">
                  {analysis.overallScore}/100
                </span>
              </div>
              <ScoreBar score={analysis.overallScore} />
            </div>
          </div>

          {/* Section Scores - More Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analysis.sections).map(([section, data]) => (
              <div key={section} className="card-border">
                <div className="card p-3">
                  <h5 className="font-semibold capitalize mb-1 text-sm">{section}</h5>
                  <div className="flex items-center justify-between mb-2">
                    <ScoreBar score={data.score} />
                    <span className="ml-2 text-xs font-medium">
                      {data.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-light-100 line-clamp-2">{data.feedback}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Steps - Key Section */}
          <div className="card-border">
            <div className="card p-4">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="mr-2 text-primary-200" size={18} />
                Next Steps & Recommendations
              </h4>

              <div className="space-y-4">
                {/* Time Allocation */}
                <div>
                  <h5 className="font-semibold mb-2">Recommended Time Allocation</h5>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-primary-200">
                        {analysis.nextSteps.timeAllocation.dsa}%
                      </div>
                      <div className="text-xs text-light-100">DSA Practice</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary-200">
                        {analysis.nextSteps.timeAllocation.development}%
                      </div>
                      <div className="text-xs text-light-100">Development</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary-200">
                        {analysis.nextSteps.timeAllocation.projects}%
                      </div>
                      <div className="text-xs text-light-100">Projects</div>
                    </div>
                  </div>
                </div>

                {/* DSA & Development in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">DSA Preparation</h5>
                    <p className="text-light-100 text-sm mb-2">
                      <strong>Level:</strong> {analysis.nextSteps.dsaBalance.currentLevel}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.nextSteps.dsaBalance.suggestedTopics.slice(0, 4).map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-200/20 text-primary-200 rounded text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2">Development Skills</h5>
                    <p className="text-light-100 text-sm mb-2">
                      <strong>Level:</strong> {analysis.nextSteps.developmentSkills.currentLevel}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.nextSteps.developmentSkills.suggestedSkills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-success-100/20 text-success-100 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h5 className="font-semibold mb-2">Suggested Projects</h5>
                  <ul className="space-y-1">
                    {analysis.nextSteps.projects.slice(0, 3).map((project, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-primary-200 mr-2">•</span>
                        <span className="text-light-100">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths and Weaknesses - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-border">
              <div className="card p-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="mr-2 text-success-100" size={16} />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-success-100 mr-2">•</span>
                      <span className="text-light-100">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-border">
              <div className="card p-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <AlertCircle className="mr-2 text-destructive-100" size={16} />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-destructive-100 mr-2">•</span>
                      <span className="text-light-100">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Resume Improvement Chat</h3>
        <p className="text-light-100 text-sm">
          Ask questions about your resume and get personalized advice
        </p>
      </div>

      <div className="card-border">
        <div className="card p-4">
          <div className="h-64 overflow-y-auto mb-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-light-400 py-8">
                <MessageCircle className="mx-auto mb-3" size={40} />
                <p className="text-sm">Start a conversation to get personalized resume advice!</p>
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary-200 text-dark-100'
                        : 'bg-dark-200 text-light-100'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="markdown-content">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 pl-4 list-disc">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 pl-4 list-decimal">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-primary-200">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => (
                              <code className="bg-dark-100 px-1 py-0.5 rounded text-primary-200 font-mono text-xs">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-dark-100 p-2 rounded mt-2 mb-2 overflow-x-auto">
                                {children}
                              </pre>
                            ),
                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-primary-200">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-md font-bold mb-2 text-primary-200">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-primary-200">{children}</h3>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-primary-200 pl-2 italic mb-2">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-dark-200 text-light-100 max-w-[80%] p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-200"></div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Ask about your resume..."
              className="flex-1 px-3 py-2 bg-dark-200 rounded-lg text-light-100 placeholder-light-400 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
              disabled={!extractedText || isChatLoading}
            />
            <button
              onClick={sendChatMessage}
              disabled={!chatInput.trim() || !extractedText || isChatLoading}
              className="btn-primary text-sm px-4"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative py-12 bg-black text-white overflow-hidden">
      {/* Grid Pattern Background */}
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "absolute inset-0 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-dark-200 rounded-lg p-1">
            {[
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'analysis', label: 'Analysis', icon: BarChart3 },
              { id: 'chat', label: 'Chat', icon: MessageCircle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                  activeTab === id
                    ? 'bg-primary-200 text-dark-100'
                    : 'text-light-100 hover:text-white'
                }`}
              >
                <Icon className="mr-2" size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && renderUploadTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'chat' && renderChatTab()}
      </div>
    </section>
  );
}
