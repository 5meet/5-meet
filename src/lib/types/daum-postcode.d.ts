export {};

interface DaumPostcodeData {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  sido: string;
  sigungu: string;
}

interface DaumPostcodeInstance {
  open: () => void;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => DaumPostcodeInstance;
    };
  }
}
