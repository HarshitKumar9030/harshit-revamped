import mongoose, { Schema, model, models } from "mongoose";

const ScrawlMetricSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

export const ScrawlMetric = models.ScrawlMetric || model("ScrawlMetric", ScrawlMetricSchema);

const TagMetricSchema = new Schema({
  name: { type: String, required: true, unique: true },
  hotness: { type: Number, default: 0 }, // tracked by how many views/hits from posts matching it
  count: { type: Number, default: 0 }, // how many posts uses it
});

export const TagMetric = models.TagMetric || model("TagMetric", TagMetricSchema);
