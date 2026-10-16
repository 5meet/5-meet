import { useRef } from "react";

export type MyMeetingActionLock = {
  current: "cancel" | "favorite" | null;
};

// Both hooks share one synchronous lock, including before React rerenders.
export function useMyMeetingActionLock() {
  return useRef<MyMeetingActionLock["current"]>(null);
}
