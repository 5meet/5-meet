import { setupWorker } from "msw/browser";
import { handlers } from "./meetingDetail/handlers";
import { reviewHandlers } from "./reviews/handlers";

export const worker = setupWorker(...handlers, ...reviewHandlers);