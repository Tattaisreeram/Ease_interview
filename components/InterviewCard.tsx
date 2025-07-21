"use client";

import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Calendar, Star, Code } from "lucide-react";
import { useRouter } from "next/navigation";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
}: InterviewCardProps) => {
  const router = useRouter();
  if (!interviewId) return null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const handleNavigation = () => {
    const href = feedback
      ? `/interview/${interviewId}/feedback`
      : `/interview/${interviewId}`;
    router.push(href);
  };

  return (
    <div className="relative w-[360px] max-sm:w-full min-h-96 bg-black border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-gray-800">
          <p className="text-sm font-semibold capitalize text-white">
            {normalizedType}
          </p>
        </div>

        {/* Standard SVG Icon instead of random image */}
        <div className="w-[90px] h-[90px] bg-gray-900 rounded-full flex items-center justify-center mb-5">
          <FileText className="w-10 h-10 text-white" />
        </div>

        <h3 className="mt-5 capitalize text-white text-xl font-semibold">
          {role} Interview
        </h3>

        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-row gap-2 items-center">
            <Calendar className="w-5 h-5 text-white" />
            <p className="text-white">{formattedDate}</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Star className="w-5 h-5 text-white" />
            <p className="text-white">{feedback?.totalScore || "---"}/100</p>
          </div>
        </div>

        <p className="line-clamp-2 mt-5 text-white">
          {feedback?.finalAssessment ||
            "You haven't taken the interview yet. Take it now to improve your skills."}
        </p>
      </div>

      <div className="flex flex-row justify-between items-center mt-6">
        <div className="flex flex-row">
          {techstack.slice(0, 3).map((tech, index) => (
            <div
              key={tech}
              className={`relative group bg-gray-900 rounded-full p-2 flex items-center justify-center border border-gray-700 ${
                index >= 1 ? "-ml-3" : ""
              }`}
            >
              <span className="absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white bg-gray-800 rounded-md shadow-md">
                {tech}
              </span>
              <Code className="w-5 h-5 text-white" />
            </div>
          ))}
        </div>

        <Button
          onClick={handleNavigation}
          className="bg-white text-black hover:bg-gray-200 font-semibold px-4 py-2 rounded-lg"
        >
          {feedback ? "Check Feedback" : "View Interview"}
        </Button>
      </div>
    </div>
  );
};

export default InterviewCard;
