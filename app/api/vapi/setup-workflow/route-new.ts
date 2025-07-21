import { NextResponse } from "next/server";

export async function POST() {
  try {
    const serverToken = process.env.VAPI_SERVER_TOKEN;

    if (!serverToken) {
      throw new Error("VAPI_SERVER_TOKEN environment variable not set");
    }

    const workflowData = {
      name: "Interview Info Collection",
      nodes: [
        {
          id: "start",
          type: "conversation",
          firstMessage: "Hi! I'm here to prepare your interview. Let's begin.",
          systemPrompt:
            "Ask the user for interview type, role, level, techstack, number of questions, and user ID.",
          extractVariables: [
            { name: "type", type: "string" },
            { name: "role", type: "string" },
            { name: "level", type: "string" },
            { name: "techstack", type: "string" },
            { name: "amount", type: "string" },
            { name: "userid", type: "string" },
          ],
        },
        {
          id: "end",
          type: "endCall",
          firstMessage: "Thanks! We will now prepare your interview questions.",
        },
      ],
      edges: [
        {
          from: "start",
          to: "end",
        },
      ],
    };

    const response = await fetch("https://api.vapi.ai/workflow", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflowData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to create workflow: ${response.status} ${
          result.message || result.error
        }`
      );
    }

    return NextResponse.json({
      success: true,
      workflowId: result.id,
      message: "Interview workflow created successfully",
      workflow: result,
    });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create workflow",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
