export {};

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (appKey: string) => void;
      Share: {
        sendDefault: (settings: {
          objectType: "feed" | "location";
          content: {
            title: string;
            description?: string;
            imageUrl: string;
            imageWidth?: number;
            imageHeight?: number;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          address?: string;
          addressTitle?: string;
          buttons?: {
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }[];
        }) => void;
      };
    };
  }
}
