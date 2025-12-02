// app/api/send-sms/route.ts - TERMII v3 WITH BOTH KEYS
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json(
        { success: false, error: "Phone and message are required" },
        { status: 400 }
      );
    }

    // Format phone number
    const formatPhoneNumber = (phone: string): string => {
      let cleaned = phone.replace(/\D/g, "");

      if (cleaned.startsWith("254") && cleaned.length === 12) {
        return cleaned;
      }

      if (cleaned.startsWith("0") && cleaned.length === 10) {
        return "254" + cleaned.substring(1);
      }

      if (cleaned.length === 9 && !cleaned.startsWith("0")) {
        return "254" + cleaned;
      }

      throw new Error(`Invalid Kenyan phone number: ${phone}`);
    };

    const formattedPhone = formatPhoneNumber(phone);

    // Use v3 API endpoint with BOTH keys
    const apiUrl = "https://v3.api.termii.com/api/sms/send";

    // Termii v3 requires BOTH api_key AND secret_key in headers
    const headers = {
      "Content-Type": "application/json",
      "api-key": process.env.TERMII_API_KEY!,
      "secret-key": process.env.TERMII_SECRET_KEY!,
    };

    // Try different sender approaches
    const attempts = [
      // Try with numeric sender
      { from: "35001" },
      // Try with 'talert'
      { from: "talert" },
      // Try with 'Termii' (default)
      { from: "Termii" },
      // Try without sender ID
      { from: undefined },
    ];

    let lastError: string = "";
    let lastResponse: any = null;

    for (const attempt of attempts) {
      try {
        const payload: any = {
          to: formattedPhone,
          sms: message,
          type: "plain",
          channel: "generic",
          ...(attempt.from && { from: attempt.from }),
        };

        console.log(`🔄 Attempt with sender: ${attempt.from || "none"}`);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        lastResponse = data;

        console.log(`📱 Response for ${attempt.from || "none"}:`, data);

        if (response.ok && data.code === "ok") {
          return NextResponse.json({
            success: true,
            messageId: data.messageId,
            balance: data.balance,
            status: data.status,
            senderUsed: attempt.from || "none",
          });
        }

        lastError = data.message || `HTTP ${response.status}`;
      } catch (error: any) {
        lastError = error.message;
        console.log(`❌ Failed with ${attempt.from || "none"}:`, error.message);
      }
    }

    throw new Error(`Termii failed: ${lastError}`);
  } catch (error: any) {
    console.error("❌ Termii v3 SMS Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        solution: [
          "1. Use v3 API endpoint: https://v3.api.termii.com/api/sms/send",
          "2. Include BOTH headers: api-key AND secret-key",
          "3. Check sender ID status in Termii dashboard",
          "4. Verify you have SMS balance",
          "Dashboard: https://accounts.termii.com",
        ],
      },
      { status: 500 }
    );
  }
}
