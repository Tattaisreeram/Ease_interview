import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { getRandomInterviewCover } from "@/lib/utils";

// GET handler for testing the API endpoint
export async function GET() {
  return Response.json({
    message: "Interview Generation API Endpoint",
    method: "POST",
    endpoint: "/api/vapi/generate",
    description: "Generate interview questions using Gemini AI",
    requiredFields: {
      type: "string - Interview type (e.g., 'technical', 'behavioral')",
      role: "string - Job role (e.g., 'Frontend Developer', 'Backend Developer')",
      level: "string - Experience level (e.g., 'junior', 'mid', 'senior')",
      techstack: "string - Technologies (e.g., 'React,Node.js,MongoDB')",
      amount: "string - Number of questions (e.g., '5', '10')",
      userid: "string - User ID for saving the interview",
    },
    example: {
      type: "technical",
      role: "Frontend Developer",
      level: "mid",
      techstack: "React,TypeScript,Next.js",
      amount: "5",
      userid: "user123",
    },
  });
}

export async function POST(request: Request) {
  try {
    // === DEBUGGING REQUEST DETAILS ===
    console.log("=== VAPI GENERATE API - DEBUG START ===");
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    // Check if request has a body
    const hasBody = request.headers.get("content-length") !== "0";
    console.log("Request has body:", hasBody);
    console.log("Content-Type:", request.headers.get("content-type"));

    // Parse body with error handling
    let body;
    try {
      body = await request.json();
      console.log("✅ Body parsed successfully");
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      console.log(
        "Raw request body (if available):",
        await request.text().catch(() => "Unable to read")
      );
      throw new Error("Invalid JSON in request body");
    }

    console.log("Generate API - Received body:", body);
    console.log("Body type:", typeof body);
    console.log("Body is null/undefined:", body == null);
    console.log(
      "Body keys:",
      body ? Object.keys(body) : "No keys (body is null/undefined)"
    );

    // Log each field individually
    if (body && typeof body === "object") {
      console.log("=== FIELD ANALYSIS ===");
      Object.entries(body).forEach(([key, value]) => {
        console.log(
          `  ${key}: "${value}" (type: ${typeof value}, length: ${
            typeof value === "string" ? value.length : "N/A"
          })`
        );
      });
    }

    const { type, role, level, techstack, amount, userid } = body || {};

    // Check for missing fields and log them
    const missing = [];
    if (!type) missing.push("type");
    if (!role) missing.push("role");
    if (!level) missing.push("level");
    if (!techstack) missing.push("techstack");
    if (!amount) missing.push("amount");
    if (!userid) missing.push("userid");

    // Detailed field presence check
    console.log("=== FIELD PRESENCE CHECK ===");
    console.log(`type: "${type}" (${typeof type}) - ${type ? "✅" : "❌"}`);
    console.log(`role: "${role}" (${typeof role}) - ${role ? "✅" : "❌"}`);
    console.log(`level: "${level}" (${typeof level}) - ${level ? "✅" : "❌"}`);
    console.log(
      `techstack: "${techstack}" (${typeof techstack}) - ${
        techstack ? "✅" : "❌"
      }`
    );
    console.log(
      `amount: "${amount}" (${typeof amount}) - ${amount ? "✅" : "❌"}`
    );
    console.log(
      `userid: "${userid}" (${typeof userid}) - ${userid ? "✅" : "❌"}`
    );

    if (missing.length > 0) {
      console.error("Generate API - Missing required fields:", missing);
      console.log("=== MISSING FIELDS DETAILS ===");
      missing.forEach((field) => {
        console.log(
          `❌ Missing: ${field} (value: ${body?.[field] || "undefined"})`
        );
      });
      return Response.json(
        {
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`,
          receivedBody: body,
          debug: {
            bodyType: typeof body,
            bodyKeys: body ? Object.keys(body) : [],
            missingFields: missing,
          },
        },
        { status: 400 }
      );
    }

    console.log("=== GEMINI GENERATION START ===");
    console.log("Generate API - Generating questions with params:", {
      type,
      role,
      level,
      techstack,
      amount,
      userid,
    });

    const promptText = `Prepare ${amount} questions for a ${level} level ${role} role. Techstack: ${techstack}. Focus: ${type}. Return as: ["Q1", "Q2", "Q3"]`;
    console.log("Gemini prompt:", promptText);

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: promptText,
    });

    console.log("Generate API - Raw AI response:", questions);

    // Clean up the AI response - remove markdown code blocks if present
    let cleanedQuestions = questions.trim();
    if (cleanedQuestions.startsWith("```json")) {
      cleanedQuestions = cleanedQuestions
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedQuestions.startsWith("```")) {
      cleanedQuestions = cleanedQuestions
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    console.log("Generate API - Cleaned response:", cleanedQuestions);

    const parsed = JSON.parse(cleanedQuestions);
    if (!Array.isArray(parsed)) {
      console.error("Generate API - AI response is not an array:", parsed);
      throw new Error("Invalid questions format - expected array");
    }

    console.log("Generate API - Parsed questions:", parsed);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: parsed,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("=== DATABASE SAVE ===");
    console.log("Generate API - Saving interview to database:", interview);
    console.log("Interview object keys:", Object.keys(interview));
    console.log("Questions count:", parsed.length);

    await db.collection("interviews").add(interview);

    console.log("Generate API - Interview saved successfully");
    console.log("=== VAPI GENERATE API - DEBUG END ===");
    return Response.json({
      success: true,
      questions: parsed,
      debug: {
        receivedFields: { type, role, level, techstack, amount, userid },
        questionsGenerated: parsed.length,
        interviewId: "saved-to-db",
      },
    });
  } catch (err) {
    console.error("=== VAPI GENERATE API - ERROR ===");
    console.error("Generate API - Error:", err);
    console.error("Error type:", typeof err);
    console.error("Error name:", err instanceof Error ? err.name : "Unknown");
    console.error(
      "Error message:",
      err instanceof Error ? err.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      err instanceof Error ? err.stack : "No stack trace"
    );

    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return Response.json(
      {
        success: false,
        message: `Failed to generate: ${errorMessage}`,
        debug: {
          errorType: typeof err,
          errorName: err instanceof Error ? err.name : "Unknown",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
