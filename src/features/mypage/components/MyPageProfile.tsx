"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUpdateProfileName } from "../hooks/useUpdateProfileName";
import MyPageProfileView from "./MyPageProfileView";

export default function MyPageProfile() {
  const query = useCurrentUser();
  const { saveName } = useUpdateProfileName(query.data?.id);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);
  const refetch = query.refetch;

  useEffect(() => {
    let active = true;
    // Reuse the GNB's query but recheck it when entering this private layout.
    // Keep cached identity hidden until this check finishes.
    void refetch({ cancelRefetch: false }).finally(() => {
      if (active) setHasCheckedUser(true);
    });
    return () => {
      active = false;
      // Next can preserve layout state while leaving the route. Revalidate on return.
      setHasCheckedUser(false);
    };
  }, [refetch]);

  const isChecking = !hasCheckedUser || query.isPending || query.isFetching;
  return (
    <>
      {isChecking && <MyPageProfileView status="loading" />}
      <div hidden={isChecking}>
        {query.isError
          ? <MyPageProfileView status="error" onRetry={() => void refetch({ cancelRefetch: false })} />
          : query.data
            ? <MyPageProfileView status="success" user={query.data} onSaveName={saveName} />
            : <MyPageProfileView status="signed-out" />}
      </div>
    </>
  );
}
