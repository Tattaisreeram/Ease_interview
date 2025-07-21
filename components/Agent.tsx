"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { createFeedback } from "@/lib/actions/general.action";
import { createVapiClient } from "@/lib/vapi.sdk";
import { interviewer, setupAssistant } from "@/constants";

interface InterviewFormData {
  type: string;
  role: string;
  level: string;
  techstack: string;
  amount: number;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  profileImage,
  mode = "assistant",
  onSetupComplete,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);

  useEffect(() => {
    // For workflow mode with Web SDK, we don't need polling since we get events directly
    // Only use polling if we have a server-side call ID from old API approach
    let intervalId: NodeJS.Timeout;

    if (
      mode === "workflow" &&
      currentCallId &&
      callStatus === CallStatus.ACTIVE &&
      currentCallId.startsWith("dev-") // Only poll for server-side calls
    ) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(
            `/api/vapi/call-status?callId=${currentCallId}`
          );
          const { success, status, call } = await response.json();

          if (success) {
            console.log("Call status:", status);

            // Update call status based on VAPI response
            if (status === "ended" || status === "completed") {
              setCallStatus(CallStatus.FINISHED);
              setCurrentCallId(null);
              clearInterval(intervalId);
            }

            // Handle any messages from the call
            if (call && call.messages) {
              const newMessages = call.messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content || msg.transcript || "",
              }));
              setMessages(newMessages);
            }
          }
        } catch (error) {
          console.error("Error checking call status:", error);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [mode, currentCallId, callStatus]);

  useEffect(() => {
    // Setup event listeners for both modes
    if (mode === "assistant" || mode === "workflow") {
      // Use VAPI event listeners for both modes since we're using Web SDK
      const vapi = createVapiClient();

      if (!vapi) {
        console.warn("VAPI client not available");
        return;
      }      const onCallStart = () => {
        console.log("VAPI call started");
        setCallStatus(CallStatus.ACTIVE);
      };

      const onCallEnd = () => {
        console.log("VAPI call ended");
        setCallStatus(CallStatus.FINISHED);
      };

      const onMessage = (message: any) => {
        if (
          message.type === "transcript" &&
          message.transcriptType === "final"
        ) {
          const newMessage = {
            role: message.role,
            content: message.transcript,
          };
          setMessages((prev) => [...prev, newMessage]);
        }

        // Handle workflow variable extraction
        if (
          message.type === "workflow-variable-extraction" ||
          message.type === "variable-extraction"
        ) {
          // Store the extracted variables for later use
          if (message.variables) {
            console.log("Variables extracted:", message.variables);
          }
        }

        // Handle workflow completion
        if (
          message.type === "workflow-completed" ||
          message.type === "workflow-finished"
        ) {
          if (message.extractedVariables) {
            console.log("Workflow completed with variables:", message.extractedVariables);
            
            // If this is a setup workflow and we have a callback, generate interview automatically
            if (onSetupComplete && type === "generate" && mode === "workflow") {
              const extractedVars = message.extractedVariables;
              const interviewData = {
                type: extractedVars.type || "Technical",
                role: extractedVars.role || "Software Engineer", 
                level: extractedVars.level || "Mid",
                techstack: extractedVars.techstack || "JavaScript,React,Node.js",
                amount: parseInt(extractedVars.amount) || 5,
                userid: userId,
              };
              
              // Call the API to generate questions
              fetch("/api/vapi/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(interviewData),
              })
              .then(response => response.json())
              .then(result => {
                if (result.success) {
                  onSetupComplete({
                    questions: result.questions,
                    interviewId: result.interviewId,
                    ...result
                  });
                } else {
                  console.error("Auto-generation failed:", result.message);
                }
              })
              .catch(error => {
                console.error("Error in auto-generation:", error);
              });
            }
          }
        }
      };

      const onSpeechStart = () => {
        console.log("Speech started");
        setIsSpeaking(true);
      };

      const onSpeechEnd = () => {
        console.log("Speech ended");
        setIsSpeaking(false);
      };

      const onError = (error: any) => {
        console.error("VAPI Error:", error);
        setCallStatus(CallStatus.INACTIVE);
      };

      vapi.on("call-start", onCallStart);
      vapi.on("call-end", onCallEnd);
      vapi.on("message", onMessage);
      vapi.on("speech-start", onSpeechStart);
      vapi.on("speech-end", onSpeechEnd);
      vapi.on("error", onError);

      return () => {
        vapi.off("call-start", onCallStart);
        vapi.off("call-end", onCallEnd);
        vapi.off("message", onMessage);
        vapi.off("speech-start", onSpeechStart);
        vapi.off("speech-end", onSpeechEnd);
        vapi.off("error", onError);
      };
    }
  }, [mode, type, userName, userId]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    const handleGenerateInterview = async () => {
      // For workflow mode, we should get the extracted variables from the call
      // For assistant mode, we extract from the conversation transcript
      let interviewData;

      if (mode === "workflow" && currentCallId) {
        // Get the call data which should contain extracted variables
        try {
          const response = await fetch(
            `/api/vapi/call-status?callId=${currentCallId}`
          );
          const { success, call } = await response.json();

          if (success && call) {
            let extractedVariables = call.extractedVariables;

            // If no extracted variables, try to extract from transcript
            if (!extractedVariables && call.transcript) {
              extractedVariables = parseTranscriptForVariables(call.transcript);
            }

            if (
              extractedVariables &&
              Object.keys(extractedVariables).length > 0
            ) {
              // Use the extracted variables from the workflow
              interviewData = {
                type: extractedVariables.type || "Technical",
                role: extractedVariables.role || "Software Engineer",
                level: extractedVariables.level || "Mid",
                techstack:
                  extractedVariables.techstack || "JavaScript,React,Node.js",
                amount: parseInt(extractedVariables.amount) || 5,
              };
            } else {
              // Try to extract from local messages as fallback
              if (messages.length > 0) {
                interviewData = extractFromTranscript();
              } else {
                interviewData = {
                  type: "Technical",
                  role: "Software Engineer",
                  level: "Mid",
                  techstack: "JavaScript,React,Node.js",
                  amount: 5,
                };
              }
            }
          } else {
            console.error("Failed to fetch call data:", response.status);
            // Fallback to local extraction
            interviewData = extractFromTranscript();
          }
        } catch (error) {
          console.error("Error fetching call data:", error);
          // Fallback to local extraction
          interviewData = extractFromTranscript();
        }
      } else {
        // Assistant mode - extract from conversation transcript
        interviewData = extractFromTranscript();
      }

      // Validate required data
      if (!userId) {
        console.error("Missing userId for interview generation");
        if (type === "generate") {
          return; // Let the dialog handle this
        }
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/vapi/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...interviewData,
            userid: userId,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (result.success) {
          // Call onSetupComplete callback if provided (for workflow setup)
          if (onSetupComplete && type === "generate") {
            onSetupComplete({
              questions: result.questions,
              interviewId: result.interviewId,
              ...result
            });
          } else if (type !== "generate") {
            router.push("/");
          }
        } else {
          console.error("API returned success: false", result.message);
          if (type !== "generate") {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error generating interview:", error);
        if (type !== "generate") {
          router.push("/");
        }
      }
    };

    // Helper function to parse transcript for variables
    const parseTranscriptForVariables = (transcript: string) => {
      const lowerTranscript = transcript.toLowerCase();
      const extracted: any = {};

      // Extract interview type
      if (lowerTranscript.includes("technical")) {
        extracted.type = "Technical";
      } else if (lowerTranscript.includes("behavioral")) {
        extracted.type = "Behavioral";
      } else if (lowerTranscript.includes("mixed")) {
        extracted.type = "Mixed";
      }

      // Extract role - look for common patterns
      const rolePatterns = [
        "software engineer",
        "frontend developer",
        "backend developer",
        "full stack developer",
        "data scientist",
        "product manager",
        "devops engineer",
        "mobile developer",
      ];

      for (const rolePattern of rolePatterns) {
        if (lowerTranscript.includes(rolePattern)) {
          extracted.role = rolePattern
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          break;
        }
      }

      // Extract experience level
      if (lowerTranscript.includes("junior")) {
        extracted.level = "Junior";
      } else if (lowerTranscript.includes("senior")) {
        extracted.level = "Senior";
      } else if (lowerTranscript.includes("mid")) {
        extracted.level = "Mid";
      }

      // Extract tech stack
      const techKeywords = [
        "javascript",
        "typescript",
        "react",
        "angular",
        "vue",
        "node",
        "python",
        "java",
        "spring",
        "express",
        "mongodb",
        "sql",
        "aws",
      ];

      const foundTech = techKeywords.filter((tech) =>
        lowerTranscript.includes(tech)
      );
      if (foundTech.length > 0) {
        extracted.techstack = foundTech.join(",");
      }

      // Extract number of questions
      const numberMatch = lowerTranscript.match(/(\d+)\s*questions?/);
      if (numberMatch) {
        extracted.amount = numberMatch[1];
      }

      return Object.keys(extracted).length > 0 ? extracted : null;
    };

    // Helper function to extract from transcript (for assistant mode)
    const extractFromTranscript = () => {
      // Get all conversation content
      const conversationText = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")
        .toLowerCase();
      console.log("Conversation text for parsing:", conversationText);

      // Extract interview type - look for explicit mentions
      let type = "Technical"; // default
      if (
        conversationText.includes("behavioral") ||
        conversationText.includes("behavior")
      ) {
        type = "Behavioral";
      } else if (
        conversationText.includes("mixed") ||
        conversationText.includes("combination")
      ) {
        type = "Mixed";
      }

      // Extract role - improved matching
      let role = "Software Engineer"; // default
      const roleKeywords = {
        frontend: "Frontend Developer",
        "front-end": "Frontend Developer",
        "front end": "Frontend Developer",
        backend: "Backend Developer",
        "back-end": "Backend Developer",
        "back end": "Backend Developer",
        "full stack": "Full Stack Developer",
        fullstack: "Full Stack Developer",
        "data scientist": "Data Scientist",
        "data analyst": "Data Analyst",
        "product manager": "Product Manager",
        devops: "DevOps Engineer",
        qa: "QA Engineer",
        "quality assurance": "QA Engineer",
        mobile: "Mobile Developer",
        android: "Android Developer",
        ios: "iOS Developer",
        "software engineer": "Software Engineer",
        developer: "Software Developer",
      };

      // Look for role mentions
      for (const [keyword, roleName] of Object.entries(roleKeywords)) {
        if (conversationText.includes(keyword)) {
          role = roleName;
          break;
        }
      }

      // Extract level
      let level = "Mid"; // default
      if (
        conversationText.includes("junior") ||
        conversationText.includes("entry") ||
        conversationText.includes("beginner")
      ) {
        level = "Junior";
      } else if (
        conversationText.includes("senior") ||
        conversationText.includes("lead") ||
        conversationText.includes("principal")
      ) {
        level = "Senior";
      }

      // Extract tech stack - comprehensive list
      const techKeywords = [
        "react",
        "angular",
        "vue",
        "svelte",
        "javascript",
        "typescript",
        "python",
        "java",
        "node",
        "nodejs",
        "express",
        "mongodb",
        "mysql",
        "postgresql",
        "sql",
        "aws",
        "docker",
        "kubernetes",
        "git",
        "html",
        "css",
        "sass",
        "redux",
        "graphql",
        "rest",
        "api",
        "microservices",
        "spring",
        "django",
        "flask",
        "laravel",
        "php",
        "ruby",
        "rails",
        "golang",
        "rust",
        "c++",
        "c#",
        "dotnet",
        ".net",
      ];
      const foundTech = techKeywords.filter((tech) =>
        conversationText.includes(tech)
      );
      const techstack =
        foundTech.length > 0 ? foundTech.join(",") : "JavaScript,React,Node.js";
      console.log("Found technologies:", foundTech);

      // Extract number of questions - improved regex
      let amount = 5; // default
      const numberMatches = [
        conversationText.match(/(\d+)\s*(questions?|interview)/),
        conversationText.match(
          /(three|four|five|six|seven|eight|nine|ten)\s*(questions?)/
        ),
        conversationText.match(/prepare\s+(\d+)/),
        conversationText.match(/(\d+)\s*mock/),
      ];

      for (const match of numberMatches) {
        if (match) {
          let num;
          if (match[1] === "three") num = 3;
          else if (match[1] === "four") num = 4;
          else if (match[1] === "five") num = 5;
          else if (match[1] === "six") num = 6;
          else if (match[1] === "seven") num = 7;
          else if (match[1] === "eight") num = 8;
          else if (match[1] === "nine") num = 9;
          else if (match[1] === "ten") num = 10;
          else num = parseInt(match[1]);

          if (num >= 3 && num <= 10) {
            amount = num;
            break;
          }
        }
      }

      const extracted = { type, role, level, techstack, amount };
      console.log("Final extracted data:", extracted);
      return extracted;
    };

    if (callStatus === CallStatus.FINISHED) {
      // For generate type, always show dialog for manual input
      if (type === "generate") {
        setShowInterviewDialog(true);
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId, mode, currentCallId, onSetupComplete]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      if (mode === "workflow") {
        // Workflow mode - use API routes
        await handleWorkflowCall();
      } else {
        // Assistant mode - use direct VAPI client
        await handleAssistantCall();
      }
    } catch (error) {
      console.error("Error initiating call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleWorkflowCall = async () => {
    if (type === "generate") {
      const vapi = createVapiClient();

      if (!vapi) {
        console.error("VAPI Web SDK not available. Cannot start workflow.");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      try {
        await vapi.start(setupAssistant, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });

        setCallStatus(CallStatus.ACTIVE);
      } catch (error) {
        console.error("Failed to start setup assistant:", error);
        setCallStatus(CallStatus.INACTIVE);
      }
    } else {
      // For interview mode, use the interviewer assistant
      await handleAssistantCall();
    }
  };

  const handleAssistantCall = async () => {
    const vapi = createVapiClient();

    if (!vapi) {
      console.error(
        "VAPI client not available - check NEXT_PUBLIC_VAPI_WEB_TOKEN"
      );
      setCallStatus(CallStatus.INACTIVE);
      return;
    }

    try {
      if (type === "generate") {
        await vapi.start(interviewer, {
          variableValues: {
            username: userName,
            userid: userId,
            setupMode: "true", // Flag to indicate this is setup mode
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }

      setCallStatus(CallStatus.ACTIVE);
    } catch (error) {
      console.error("Error in handleAssistantCall:", error);
      setCallStatus(CallStatus.INACTIVE);
      throw error; // Re-throw to be caught by handleCall
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    setCurrentCallId(null);

    if (mode === "assistant") {
      const vapi = createVapiClient();
      if (vapi) {
        vapi.stop();
      }
    } else {
      // Workflow mode - call management is handled server-side
      console.log("Workflow call ended by user");
    }

    // Show interview setup dialog for generate type (always show for manual input)
    if (type === "generate") {
      setShowInterviewDialog(true);
    }
  };

  const handleInterviewFormSubmit = async (formData: InterviewFormData) => {
    setIsGeneratingInterview(true);

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userid: userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Call onSetupComplete callback if provided (for workflow setup)
        if (onSetupComplete && type === "generate") {
          onSetupComplete({
            questions: result.questions,
            interviewId: result.interviewId,
            ...result
          });
          setShowInterviewDialog(false);
        } else {
          setShowInterviewDialog(false);
          router.push("/");
        }
      } else {
        console.error("API returned success: false", result.message);
        throw new Error(result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error generating interview:", error);
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  const InterviewSetupDialog = () => {
    // Extract data from messages if available, otherwise use defaults
    const extractDataFromMessages = () => {
      if (messages.length === 0) {
        return {
          type: "Technical",
          role: "Software Engineer",
          level: "Mid",
          techstack: "JavaScript,React,Node.js",
          amount: 5,
        };
      }

      // Use the same extraction logic as in handleGenerateInterview
      const conversationText = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")
        .toLowerCase();

      // Extract interview type
      let type = "Technical";
      if (conversationText.includes("behavioral")) {
        type = "Behavioral";
      } else if (conversationText.includes("mixed")) {
        type = "Mixed";
      }

      // Extract role
      let role = "Software Engineer";
      const roleKeywords = {
        frontend: "Frontend Developer",
        "front-end": "Frontend Developer",
        backend: "Backend Developer",
        "back-end": "Backend Developer",
        "full stack": "Full Stack Developer",
        "data scientist": "Data Scientist",
        "product manager": "Product Manager",
        devops: "DevOps Engineer",
        mobile: "Mobile Developer",
      };

      for (const [keyword, roleName] of Object.entries(roleKeywords)) {
        if (conversationText.includes(keyword)) {
          role = roleName;
          break;
        }
      }

      // Extract level
      let level = "Mid";
      if (conversationText.includes("junior")) {
        level = "Junior";
      } else if (conversationText.includes("senior")) {
        level = "Senior";
      }

      // Extract tech stack
      const techKeywords = [
        "react", "angular", "vue", "javascript", "typescript", "python", 
        "java", "node", "express", "mongodb", "mysql", "sql", "aws"
      ];
      const foundTech = techKeywords.filter((tech) =>
        conversationText.includes(tech)
      );
      const techstack = foundTech.length > 0 ? foundTech.join(",") : "JavaScript,React,Node.js";

      // Extract amount
      let amount = 5;
      const numberMatch = conversationText.match(/(\d+)\s*(questions?|interview)/);
      if (numberMatch) {
        const num = parseInt(numberMatch[1]);
        if (num >= 3 && num <= 10) {
          amount = num;
        }
      }

      return { type, role, level, techstack, amount };
    };

    const [formData, setFormData] = useState<InterviewFormData>(() => 
      extractDataFromMessages()
    );

    const handleInputChange = (
      field: keyof InterviewFormData,
      value: string | number
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleInterviewFormSubmit(formData);
    };

    const handleCancel = () => {
      setShowInterviewDialog(false);
      router.push("/");
    };

    if (!showInterviewDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="interview-dialog rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold mb-2">
            Setup Your Interview
          </h2>
          {messages.length > 0 && (
            <p className="text-sm text-gray-400 mb-4">
              ✨ Form pre-filled based on your conversation
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Interview Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full p-2 rounded-md focus:ring-2 focus:ring-white focus:border-white"
                required
              >
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Role/Position
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full p-2 rounded-md focus:ring-2 focus:ring-white focus:border-white"
                required
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">
                  Full Stack Developer
                </option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Product Manager">Product Manager</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="QA Engineer">QA Engineer</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange("level", e.target.value)}
                className="w-full p-2 rounded-md focus:ring-2 focus:ring-white focus:border-white"
                required
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Technologies/Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.techstack}
                onChange={(e) => handleInputChange("techstack", e.target.value)}
                className="w-full p-2 rounded-md focus:ring-2 focus:ring-white focus:border-white"
                placeholder="React,TypeScript,Node.js,MongoDB"
                required
              />
              <p className="text-xs mt-1">
                Example: React,TypeScript,Node.js,MongoDB,AWS
              </p>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Questions
              </label>
              <select
                value={formData.amount}
                onChange={(e) =>
                  handleInputChange("amount", parseInt(e.target.value))
                }
                className="w-full p-2 rounded-md focus:ring-2 focus:ring-white focus:border-white"
                required
              >
                <option value={3}>3 Questions</option>
                <option value={4}>4 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={6}>6 Questions</option>
                <option value={7}>7 Questions</option>
                <option value={8}>8 Questions</option>
                <option value={9}>9 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            {/* User ID Display */}
            <div>
              <label className="block text-sm font-medium mb-1">
                User ID (Auto-filled)
              </label>
              <input
                type="text"
                value={userId || "Not available"}
                disabled
                className="w-full p-2 rounded-md opacity-60"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-white"
                disabled={isGeneratingInterview}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-white disabled:opacity-50"
                disabled={isGeneratingInterview}
              >
                {isGeneratingInterview ? "Generating..." : "Generate Interview"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <InterviewSetupDialog />

      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            {/* Generic AI/Robot SVG Icon */}
            <svg
              width={65}
              height={54}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="object-cover"
            >
              <path
                d="M12 2L13.09 8.26L15 7L16.91 8.26L18 2H12Z"
                fill="white"
              />
              <rect x="6" y="9" width="12" height="10" rx="2" fill="white" />
              <circle cx="9" cy="12" r="1" fill="black" />
              <circle cx="15" cy="12" r="1" fill="black" />
              <rect x="10" y="15" width="4" height="1" fill="black" />
              <rect x="7" y="19" width="2" height="3" fill="white" />
              <rect x="15" y="19" width="2" height="3" fill="white" />
            </svg>
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            {/* Generic User SVG Icon */}
            <svg
              width={120}
              height={120}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rounded-full"
            >
              <circle cx="12" cy="8" r="4" fill="white" />
              <path
                d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21H6Z"
                fill="white"
              />
            </svg>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {(callStatus === CallStatus.CONNECTING ||
        callStatus === CallStatus.ACTIVE ||
        isGeneratingInterview) && (
        <div className="w-full flex justify-center mb-4">
          <div className="flex items-center space-x-2 text-white">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">
              {isGeneratingInterview
                ? "Generating your interview questions..."
                : callStatus === CallStatus.CONNECTING
                ? "Setting up workflow..."
                : currentCallId
                ? `Call active (ID: ${currentCallId.slice(0, 8)}...)`
                : "Processing..."}
            </span>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center gap-2">
        {callStatus !== "ACTIVE" && !isGeneratingInterview ? (
          <>
            <button className="relative btn-call" onClick={() => handleCall()}>
              <span
                className={cn(
                  "absolute animate-ping rounded-full opacity-75",
                  callStatus !== "CONNECTING" && "hidden"
                )}
              />

              <span className="relative">
                {callStatus === "INACTIVE"
                  ? type === "generate"
                    ? `Start Interview Setup (${mode})`
                    : `Start Interview (${mode})`
                  : callStatus === "FINISHED"
                  ? "Call Again"
                  : callStatus === "CONNECTING"
                  ? "Connecting..."
                  : "Connecting..."}
              </span>
            </button>
          </>
        ) : !isGeneratingInterview ? (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Agent;
