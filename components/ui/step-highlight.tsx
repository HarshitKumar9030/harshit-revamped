import { StepWidget } from "./step-widget";

type StepsApiResponse = {
  total_daily_steps?: number | string;
  date?: string;
};

export async function StepHighlight() {
  let steps = 0;
  let dateLabel = "";

  try {
    const res = await fetch("https://steps.harshit.page/api/steps", { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as StepsApiResponse;
      steps = Number(data?.total_daily_steps) || 0;
      dateLabel = data?.date ? new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
    }
  } catch {
    // Ignore fetch errors.
  }

  if (!steps) return null;

  return <StepWidget steps={steps} dateLabel={dateLabel} />;
}