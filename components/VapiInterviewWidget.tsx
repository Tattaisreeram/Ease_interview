"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createFeedback } from "@/lib/actions/general.action";

// Declare the custom VAPI widget element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vapi-widget": {
        "public-key": string;
        mode: string;
        assistant: string;
        "show-transcript": string;
        style?: string;
      };
    }
  }
}

interface VapiInterviewWidgetProps {
  userName: string;
  userId: string;
  interviewId: string;
  type: "interview" | "generate";
  questions?: string[];
  feedbackId?: string;
  publicKey?: string;
}

// Define the message interface based on VAPI documentation
interface VapiMessage {
  type: string;
  role?: string;
  content?: string;
  transcript?: string;
  transcriptType?: string;
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const VapiInterviewWidget: React.FC<VapiInterviewWidgetProps> = ({
  userName,
  userId,
  interviewId,
  type,
  questions = [],
  feedbackId,
  publicKey = "a3d38d93-3d21-4de3-a672-364f40f52a37",
}) => {
  const router = useRouter();
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Create dynamic assistant configuration based on type
  const createAssistantConfig = () => {
    if (type === "interview" && questions.length > 0) {
      // Interview mode with specific questions
      const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");

      return {
        name: "AI Interviewer",
        firstMessage:
          "Hi there! I'm Sarah, and I'll be conducting your interview today. Thanks for taking the time to speak with me.",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
        voice: {
          provider: "11labs",
          voiceId: "sarah",
          stability: 0.4,
          similarityBoost: 0.8,
          speed: 0.9,
          style: 0.5,
          useSpeakerBoost: true,
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Act like a real human interviewer — warm, casual, and friendly.

INTERVIEW FLOW:
1. Start with a warm introduction: "Hi there! I'm Sarah, and I'll be conducting your interview today. Thanks for taking the time to speak with me."

2. Ask the candidate to introduce themselves: "Before we dive into the technical questions, could you please introduce yourself and tell me about your recent experience?"

3. Listen to their introduction and respond naturally: "That's great!" or "Interesting background!" or "Thanks for sharing that!"

4. Then follow the structured questions:
${formattedQuestions}

RESPONSE GUIDELINES:
- Evaluate each answer for technical accuracy and provide realistic feedback
- For CORRECT answers, respond with phrases like:
  • "That's absolutely right!"
  • "Exactly! Great explanation."
  • "Perfect, you nailed that one."
  • "Spot on! I like how you explained that."
  • "That's a solid answer."

- For PARTIALLY CORRECT answers, respond with:
  • "You're on the right track, but there's a bit more to it."
  • "Good start, can you elaborate on that?"
  • "That's partially correct. What else would you add?"
  • "You got the main idea, but let's dig deeper."

- For INCORRECT answers, respond with:
  • "Hmm, that's not quite right."
  • "Actually, that's not accurate."
  • "I think you might be confusing that with something else."
  • "Not exactly. Let me give you a hint..."
  • "That's off the mark. Want to try again?"

CONVERSATION STYLE:
- Talk like a real human interviewer, not an AI
- Use natural conversation fillers: "Right," "I see," "Interesting," "Okay"
- Show genuine interest in their answers
- Ask follow-up questions when answers are vague
- Keep responses SHORT (1-2 sentences max)
- Sound conversational, not formal

INTERVIEW CONCLUSION:
End with: "That wraps up our interview! Thanks for your time today. We'll be in touch soon with feedback. Have a great day!"

Remember: You're having a real conversation, not reading from a script. Be human, be natural, be genuine.`,
            },
          ],
        },
      };
    } else {
      // Generate mode - for collecting interview requirements
      return {
        name: "Interview Setup Assistant",
        firstMessage:
          "Hi! I'm here to help you set up your mock interview. I'll ask you a few quick questions to create the perfect interview for you.",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
        voice: {
          provider: "11labs",
          voiceId: "sarah",
          stability: 0.4,
          similarityBoost: 0.8,
          speed: 0.9,
          style: 0.5,
          useSpeakerBoost: true,
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an interview setup assistant. Your job is to collect information to create a personalized mock interview.

Ask these questions in order and be conversational:

1. "What type of interview would you like? You can choose Technical, Behavioral, or Mixed."
2. "What role or position are you preparing for?" 
3. "What's your experience level - Junior, Mid-level, or Senior?"
4. "What technologies or skills should we focus on? For example: React, Python, AWS, etc."
5. "How many questions would you like? I can create between 3 to 10 questions."

IMPORTANT: After they answer each question, briefly acknowledge their answer using their exact words. For example:
- "Great! So we're doing a {{type}} interview."
- "Perfect! {{role}} position it is."
- "Got it! {{level}} level experience."
- "Excellent! We'll focus on {{techstack}}."
- "Perfect! I'll create {{amount}} questions for you."

Variables to extract and use:
- type: Technical/Behavioral/Mixed
- role: Job position/role name
- level: Junior/Mid/Senior
- techstack: Technologies/skills mentioned
- amount: Number of questions (3-10)

After collecting all information, summarize everything clearly: "Alright, I have everything I need. I'm creating a {{type}} interview for a {{role}} position at {{level}} level, focusing on {{techstack}}, with {{amount}} questions. Your interview will be ready shortly!"

Keep responses very short and natural for voice conversation. One sentence responses are perfect.`,
            },
          ],
        },
      };
    }
  };

  // Handle messages from VAPI widget
  const handleMessage = (event: CustomEvent<VapiMessage>) => {
    const message = event.detail;
    console.log("VAPI Message:", message);

    if (message.type === "transcript" && message.transcriptType === "final") {
      const newMessage: SavedMessage = {
        role: message.role as "user" | "system" | "assistant",
        content: message.transcript || message.content || "",
      };

      setMessages((prev) => [...prev, newMessage]);
      console.log("New message added:", newMessage);
    }
  };

  // Handle call start
  const handleCallStart = (event: CustomEvent) => {
    console.log("Call started:", event.detail);
    setIsCallActive(true);
  };

  // Handle call end
  const handleCallEnd = (event: CustomEvent) => {
    console.log("Call ended:", event.detail);
    setIsCallActive(false);

    if (type === "interview" && messages.length > 0) {
      // Generate feedback for completed interview
      handleGenerateFeedback();
    } else if (type === "generate" && messages.length > 0) {
      // Extract information and generate interview
      handleGenerateInterview();
    }
  };

  // Generate interview from conversation
  const handleGenerateInterview = async () => {
    console.log("Generating interview from conversation...");

    try {
      // Extract interview data from conversation
      const conversationText = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")
        .toLowerCase();

      // Basic extraction logic (you can enhance this)
      const extractedData = {
        type: conversationText.includes("technical")
          ? "Technical"
          : conversationText.includes("behavioral")
          ? "Behavioral"
          : "Technical",
        role: extractJobRole(conversationText),
        level: extractLevel(conversationText),
        techstack: extractTechStack(conversationText),
        amount: extractAmount(conversationText),
      };

      // Generate interview using the API
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...extractedData,
          userid: userId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Interview generated successfully");
        router.push("/");
      } else {
        console.error("Failed to generate interview:", result.message);
      }
    } catch (error) {
      console.error("Error generating interview:", error);
    }
  };

  // Helper functions for extraction
  const extractJobRole = (text: string): string => {
    const roles = [
      "software engineer",
      "frontend developer",
      "backend developer",
      "full stack developer",
      "data scientist",
      "product manager",
    ];
    for (const role of roles) {
      if (text.includes(role)) {
        return role
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    }
    return "Software Engineer";
  };

  const extractLevel = (text: string): string => {
    if (text.includes("junior")) return "Junior";
    if (text.includes("senior")) return "Senior";
    return "Mid";
  };

  const extractTechStack = (text: string): string => {
    const techs = [
      "react",
      "angular",
      "vue",
      "node",
      "python",
      "java",
      "javascript",
    ];
    const found = techs.filter((tech) => text.includes(tech));
    return found.length > 0 ? found.join(",") : "JavaScript,React,Node.js";
  };

  const extractAmount = (text: string): string => {
    const match = text.match(/(\d+)\s*questions?/);
    return match ? match[1] : "5";
  };

  // Generate feedback after interview
  const handleGenerateFeedback = async () => {
    console.log("🎯 Generating feedback for interview...");
    console.log("📝 Total messages collected:", messages.length);

    // Debug: Log the entire conversation
    console.log("📋 Full conversation transcript:");
    messages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg.role}: ${msg.content}`);
    });

    setIsGeneratingFeedback(true);

    try {
      // Format the transcript for Gemini analysis
      const formattedTranscript = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log("🚀 Sending to Gemini for analysis...");
      console.log("📊 Formatted transcript:", formattedTranscript);

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId,
        userId: userId,
        transcript: formattedTranscript,
        feedbackId,
      });

      if (success && id) {
        console.log(
          "✅ Feedback generated successfully, redirecting to feedback page"
        );
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.error("❌ Error saving feedback");
        router.push("/");
      }
    } catch (error) {
      console.error("❌ Error generating feedback:", error);
      router.push("/");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  // Setup event listeners when component mounts
  useEffect(() => {
    const widget = document.querySelector("vapi-widget");

    if (widget) {
      widget.addEventListener("message", handleMessage as EventListener);
      widget.addEventListener("call-start", handleCallStart as EventListener);
      widget.addEventListener("call-end", handleCallEnd as EventListener);
    }

    return () => {
      if (widget) {
        widget.removeEventListener("message", handleMessage as EventListener);
        widget.removeEventListener(
          "call-start",
          handleCallStart as EventListener
        );
        widget.removeEventListener("call-end", handleCallEnd as EventListener);
      }
    };
  }, []);

  // Load VAPI widget script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";
    script.async = true;
    script.type = "text/javascript";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const assistantConfig = createAssistantConfig();

  return (
    <div className="vapi-interview-container">
      {/* Status indicator */}
      {isCallActive && (
        <div className="w-full flex justify-center mb-4">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="animate-pulse rounded-full h-3 w-3 bg-green-600"></div>
            <span className="text-sm">Interview in progress...</span>
          </div>
        </div>
      )}

      {isGeneratingFeedback && (
        <div className="w-full flex justify-center mb-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Generating feedback...</span>
          </div>
        </div>
      )}

      {/* User info display */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">
          {type === "interview" ? "Interview Session" : "Interview Setup"}
        </h3>
        <p className="text-sm text-gray-600">Welcome, {userName}!</p>
        {type === "interview" && (
          <p className="text-xs text-gray-500 mt-1">
            {questions.length} questions prepared
          </p>
        )}
      </div>

      {/* VAPI Widget */}
      <div className="flex justify-center">
        <div
          ref={(el) => {
            if (el && !el.querySelector("vapi-widget")) {
              const widget = document.createElement("vapi-widget") as any;
              widget.setAttribute("public-key", publicKey);
              widget.setAttribute("mode", "voice");
              widget.setAttribute("assistant", JSON.stringify(assistantConfig));
              widget.setAttribute("show-transcript", "true");
              widget.style.cssText =
                "--vapi-widget-height: 400px; --vapi-widget-width: 300px;";
              el.appendChild(widget);
            }
          }}
          className="vapi-widget-container"
        />
      </div>

      {/* Transcript display */}
      {messages.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Conversation Transcript:</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  message.role === "user"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <strong>{message.role}:</strong> {message.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VapiInterviewWidget;
