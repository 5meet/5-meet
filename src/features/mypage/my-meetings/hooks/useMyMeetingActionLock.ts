import { useRef } from "react";

export type MyMeetingActionLock = {
  current: { cancelPending: boolean; favoriteIds: Set<number> };
};

// Reserve synchronously, before React can render the disabled controls.
export function useMyMeetingActionLock() {
  return useRef<MyMeetingActionLock["current"]>({ cancelPending: false, favoriteIds: new Set() });
}
