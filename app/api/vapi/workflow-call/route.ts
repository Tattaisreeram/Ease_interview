import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { workflowId, phoneNumber, variableValues } = await request.json();

    if (!workflowId) {
      return NextResponse.json(
        { success: false, message: "Missing workflowId" },
        { status: 400 }
      );
    }

    const serverToken = process.env.VAPI_SERVER_TOKEN;
    if (!serverToken) {
      throw new Error("VAPI_SERVER_TOKEN environment variable not set");
    }

    console.log("Creating workflow call with ID:", workflowId);
    console.log("Variable values:", variableValues);

    // For workflows, we need to create an outbound phone call with the workflow
    // Use a properly formatted phone number for production
    const callPayload: any = {
      type: "outboundPhoneCall",
      workflowId: workflowId,
      customer: {
        number: phoneNumber || "+15551234567", // Properly formatted E.164 phone number
      },
    };

    console.log("Call payload:", JSON.stringify(callPayload, null, 2));

    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Workflow call creation failed:", errorText);
      console.error("Response status:", response.status);
      console.error("Call payload was:", JSON.stringify(callPayload, null, 2));

      // Provide specific error messages for different scenarios
      if (response.status === 400) {
        console.log("Bad request - check workflow configuration");
        return NextResponse.json(
          {
            success: false,
            message: "Invalid workflow call configuration",
            error: errorText,
            debug: {
              payload: callPayload,
              status: response.status,
              suggestion:
                "Check if workflow ID is valid and workflow is properly configured",
            },
          },
          { status: 400 }
        );
      }

      if (response.status === 401) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication failed - check VAPI server token",
            error: errorText,
          },
          { status: 401 }
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            message: "Access forbidden - check VAPI account permissions",
            error: errorText,
          },
          { status: 403 }
        );
      }

      throw new Error(
        `Failed to create workflow call: ${response.status} ${errorText}`
      );
    }

    const callData = await response.json();
    console.log("Workflow call created successfully:", callData);

    return NextResponse.json({
      success: true,
      callId: callData.id,
      webCallUrl: callData.webCallUrl,
      message: "Workflow call created successfully",
      callData: callData,
    });
  } catch (error) {
    console.error("Error creating workflow call:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create workflow call",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
