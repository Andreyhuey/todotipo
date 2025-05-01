import moment from "moment";

export function formatDate(dateStr: string): string {
  return moment(dateStr).format("MMMM, YYYY");
}
