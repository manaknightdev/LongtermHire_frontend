import { StringCaser } from "@/utils";

// Helper function for modal titles
export function determineModalTitle(modal: string) {
  const stringCaser = new StringCaser();
  const modalSplit = modal.split("_");
  const includesDate = modalSplit.includes("date");
  const includesTime = modalSplit.includes("time");

  if (includesDate && includesTime) {
    return "Pick date & time";
  }

  if (includesDate) {
    return "Pick date";
  }

  if (includesTime) {
    return "Select Time";
  }

  const title = stringCaser.Capitalize(modal, { separator: "space" });
  return title;
}
