let mockingPromise: Promise<void> | null = null;

export function initMocks() {
  if (typeof window === "undefined") return Promise.resolve();

  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") {
    return Promise.resolve();
  }

  if (mockingPromise) {
    return mockingPromise;
  }

  mockingPromise = (async () => {
    const { worker } = await import("./browser");

    await worker.start({
      onUnhandledRequest: "bypass", // mock 안 걸린 요청(카카오 SDK 등)은 그대로 실제 네트워크로
    });
  })();

  return mockingPromise;
}
