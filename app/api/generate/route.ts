import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/lib/mongodb";
import Generation from "@/app/models/Generation";
// import Generation from "@/models/Generation";

const ratioMap: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Fadlan soo gal (Sign in) si aad u dhaliso sawir" }, { status: 401 });
    }

    const { prompt, imageCount, ratio } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const count = Math.min(Number(imageCount) || 1, 4);
    const size = ratioMap[ratio] || ratioMap["1:1"];
    const images: string[] = [];

    for (let i = 0; i < count; i++) {
      const seed = Math.floor(Math.random() * 10000000);
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${size.width}&height=${size.height}&seed=${seed}&model=flux&nologo=true`;

      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to generate image");

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      images.push(`data:image/png;base64,${base64}`);
    }

    await connectToDB();
    const newGeneration = await Generation.create({
      userEmail: session.user.email, 
      prompt,
      images,
      ratio,
    });

    return NextResponse.json({ success: true, data: newGeneration });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ history: [] });
    }

    await connectToDB();
    const history = await Generation.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .limit(30);

    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try{

    const session = await getServerSession(authOptions);
    if(!session?.user?.email){
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get("id");

    if(!id){
      return NextResponse.json({error: "Generation ID is required"}, {status: 400});
    }
    
    await connectToDB();

    const deletedItem = await Generation.findOneAndDelete({ _id: id, userEmail: session.user.email });

    if(!deletedItem){
      return NextResponse.json({error: "Generation not found or not authorized"}, {status: 404});
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });

  }catch(error: any){
    return NextResponse.json({error: error.message}, {status: 500});
  }
}