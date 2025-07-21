"use client";

import { useState, useEffect } from "react";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState<"setup" | "interview">("setup");
  const [interviewData, setInterviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data on client side
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSetupComplete = (data: any) => {
    console.log("Setup completed with data:", data);
    setInterviewData(data);
    setCurrentStage("interview");
  };

  if (isLoading) {
    return (
      <div className="interview-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {currentStage === "setup" ? (
          <>
            <h3 className="text-3xl font-semibold text-center mb-4 text-white">
              Interview Setup
            </h3>
            <p className="text-center text-gray-300 mb-8">
              Let's gather some information about the interview you'd like to practice
            </p>

            <Agent
              userName={user?.name || "User"}
              userId={user?.id || ""}
              type="generate"
              mode="workflow"
              onSetupComplete={handleSetupComplete}
            />
          </>
        ) : (
          <>
            <h3 className="text-3xl font-semibold text-center mb-4 text-white">
              Interview Started
            </h3>
            <p className="text-center text-gray-300 mb-8">
              Your personalized interview is ready. Good luck!
            </p>

            <Agent
              userName={user?.name || "User"}
              userId={user?.id || ""}
              type="interview"
              mode="assistant"
              questions={interviewData?.questions}
            />
          </>
        )}

        {/* Stage indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              currentStage === "setup" ? "text-blue-400" : "text-green-400"
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                currentStage === "setup" ? "bg-blue-400 animate-pulse" : "bg-green-400"
              }`}></div>
              <span className="text-sm">Setup</span>
            </div>
            
            <div className="w-8 h-px bg-gray-600"></div>
            
            <div className={`flex items-center space-x-2 ${
              currentStage === "interview" ? "text-blue-400" : "text-gray-500"
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                currentStage === "interview" ? "bg-blue-400 animate-pulse" : "bg-gray-600"
              }`}></div>
              <span className="text-sm">Interview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
