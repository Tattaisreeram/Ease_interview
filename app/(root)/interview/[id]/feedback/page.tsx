import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="interview-page min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <section className="section-feedback">
          <div className="flex flex-row justify-center">
            <h1 className="text-4xl font-semibold">
              Feedback on the Interview -{" "}
              <span className="capitalize">{interview.role}</span> Interview
            </h1>
          </div>

          <div className="flex flex-row justify-center ">
            <div className="flex flex-row gap-5">
              {/* Overall Impression */}
              <div className="flex flex-row gap-2 items-center">
                {/* Generic Star SVG Icon */}
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
                <p>
                  Overall Impression:{" "}
                  <span className="font-bold">
                    {feedback?.totalScore}
                  </span>
                  /100
                </p>
              </div>

              {/* Date */}
              <div className="flex flex-row gap-2">
                {/* Generic Calendar SVG Icon */}
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" fill="white" />
                  <path d="M16 2V6M8 2V6M3 10H21" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>
                  {feedback?.createdAt
                    ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <hr />

          <p>{feedback?.finalAssessment}</p>

          {/* Interview Breakdown */}
          <div className="flex flex-col gap-4">
            <h2>Breakdown of the Interview:</h2>
            {feedback?.categoryScores?.map((category, index) => (
              <div key={index}>
                <p className="font-bold">
                  {index + 1}. {category.name} ({category.score}/100)
                </p>
                <p>{category.comment}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3>Strengths</h3>
            <ul>
              {feedback?.strengths?.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3>Areas for Improvement</h3>
            <ul>
              {feedback?.areasForImprovement?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="buttons">
            <Button className="btn-secondary flex-1">
              <Link href="/" className="flex w-full justify-center">
                <p className="text-sm font-semibold text-primary-200 text-center">
                  Back to dashboard
                </p>
              </Link>
            </Button>

            <Button className="btn-primary flex-1">
              <Link
                href={`/interview/${id}`}
                className="flex w-full justify-center"
              >
                <p className="text-sm font-semibold text-black text-center">
                  Retake Interview
                </p>
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Feedback;
