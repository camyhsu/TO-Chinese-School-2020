import moment from "moment-timezone";

export const nowPacific = () => moment().tz("America/Los_Angeles");
export const todayPacificString = () => nowPacific().format("YYYY-MM-DD");

export const nowIsAfterPacificDate = (dateString) =>
  nowPacific().isAfter(moment.tz(dateString, "America/Los_Angeles"), "day");
export const nowIsBeforePacificDate = (dateString) =>
  nowPacific().isBefore(moment.tz(dateString, "America/Los_Angeles"), "day");
