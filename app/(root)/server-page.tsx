import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import Page from "./client-page";

const ServerPage = async () => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return (
      <Page userInterviews={[]} latestInterviews={[]} userId={undefined} />
    );
  }

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  // Fetch feedback for user interviews
  const userInterviewsWithFeedback = await Promise.all(
    (userInterviews || []).map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user.id,
      });
      return {
        ...interview,
        feedback,
      };
    })
  );

  // Fetch feedback for latest interviews
  const latestInterviewsWithFeedback = await Promise.all(
    (latestInterviews || []).map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user.id,
      });
      return {
        ...interview,
        feedback,
      };
    })
  );

  return (
    <Page
      userInterviews={userInterviewsWithFeedback || []}
      latestInterviews={latestInterviewsWithFeedback || []}
      userId={user.id}
    />
  );
};

export default ServerPage;
