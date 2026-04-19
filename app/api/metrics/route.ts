import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ScrawlMetric, TagMetric } from "@/lib/models";

export async function POST(req: Request) {
  try {
    const { slug, tags } = await req.json();
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: "No DB connection configured." });
    }
    
    // Increment post views
    const postMetric = await ScrawlMetric.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );
    
    // Increment tag hotness
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        await TagMetric.findOneAndUpdate(
          { name: tag.toLowerCase() },
          { $inc: { hotness: 1 } },
          { new: true, upsert: true }
        );
      }
    }
    
    return NextResponse.json({ success: true, views: postMetric.views });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');

  try {
    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ success: false, message: "No DB connection configured." });

    if (tag) {
      const metric = await TagMetric.findOne({ name: tag.toLowerCase() });
      return NextResponse.json({ success: true, tag: metric });
    }

    const allMetrics = await TagMetric.find().sort({ hotness: -1 }).limit(20);
    return NextResponse.json({ success: true, tags: allMetrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
