import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  //testing deployment
  return (
    <div className="interview-page min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-row gap-4 items-center max-sm:flex-col">
            <div className="flex flex-row gap-4 items-center">
              {/* Generic Interview SVG Icon */}
              <svg
                width={40}
                height={40}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rounded-full"
              >
                <rect x="3" y="4" width="18" height="13" rx="2" fill="white" />
                <path d="M7 8H17M7 12H13" stroke="black" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="19" r="2" fill="white" />
                <path d="M10 19H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3 className="capitalize">
                {interview.role} Interview
              </h3>
            </div>

            <DisplayTechIcons techStack={interview.techstack} useInterviewTheme={true} />
          </div>

          <p className="bg-gray-800 px-4 py-2 rounded-lg h-fit border border-white">
            {interview.type}
          </p>
        </div>

        <Agent
          userName={user?.name!}
          userId={user?.id}
          interviewId={id}
          type="interview"
          questions={interview.questions}
          feedbackId={feedback?.id}
        />
      </div>
    </div>
  );
};

export default InterviewDetails;
