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

    // Optionally forward to external ingestion endpoint when configured
    try {
      const endpoint = process.env.HARSHIT_METRICS_ENDPOINT || process.env.NEXT_PUBLIC_METRICS_ENDPOINT || "https://metrics.harshit.page/api/collect";
      const apiKey = process.env.HARSHIT_METRICS_KEY;
      if (endpoint && apiKey) {
        // fire-and-forget
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ event: "scrawl_view", properties: { slug, tags } }),
        }).catch(() => {});
      }
    } catch (e) {
      // ignore forwarding errors
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
