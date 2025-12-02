import { NextRequest, NextResponse } from "next/server";
import africastalking from "africastalking";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { phone, message } = await request.json();

    // Validate input
    if (!phone || !message) {
      return NextResponse.json(
        { success: false, error: "Phone and message are required" },
        { status: 400 }
      );
    }

    // Log credentials (masked)
    console.log("🔑 Credentials check:", {
      hasApiKey: !!process.env.AT_API_KEY,
      hasUsername: !!process.env.AT_USERNAME,
      username: process.env.AT_USERNAME,
    });

    // Initialize Africa's Talking
    const sms = africastalking({
      apiKey: process.env.AT_API_KEY!,
      username: process.env.AT_USERNAME!,
    }).SMS;

    // Send SMS
    const result = (await sms.send({
      to: ["+254700000000"],
      from: process.env.AT_USERNAME!,
      message,
    })) as any;

    // Return success response
    return NextResponse.json({
      success: true,
      messageId: result?.SMSMessageData?.Recipients?.[0]?.messageId,
      status: result?.SMSMessageData?.Recipients?.[0]?.status,
      cost: result?.SMSMessageData?.Recipients?.[0]?.cost,
    });
  } catch (error: any) {
    console.error("SMS Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send SMS",
      },
      { status: 500 }
    );
  }
}
