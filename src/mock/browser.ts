import { setupWorker } from "msw/browser";
import { handlers } from "./meetingDetail/handlers";

export const worker = setupWorker(...handlers);
