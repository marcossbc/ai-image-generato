import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Fadlan soo geli prompt" },
        { status: 400 }
      );
    }

    // Clean and encode the prompt for URL safety
    const cleanPrompt = encodeURIComponent(prompt.trim());
    
    // Direct, ultra-fast Pollinations Image Generation URL with custom seed for freshness
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://pollinations.ai/p/${cleanPrompt}?width=1280&height=720&seed=${seed}&model=flux`;

    // Fetch the raw image directly on the server to verify it loads without DNS issues
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Sawirka lagu ma guulaysan in la soo saaro." },
        { status: response.status }
      );
    }

    // Convert image buffer to base64 so frontend receives the complete image instantly
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      videoUrl: dataUrl,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Fetch error: " + error.message },
      { status: 500 }
    );
  }
}