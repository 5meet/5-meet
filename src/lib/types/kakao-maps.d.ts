export {};

declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Map {
    constructor(
      container: HTMLElement,
      options: { center: LatLng; level: number },
    );
  }

  class Marker {
    constructor(options: { position: LatLng; map?: Map });
  }

  class InfoWindow {
    constructor(options: { content: string });
    open(map: Map, marker: Marker): void;
  }

  function load(callback: () => void): void;

  namespace services {
    enum Status {
      OK = "OK",
      ZERO_RESULT = "ZERO_RESULT",
      ERROR = "ERROR",
    }

    interface GeocoderResult {
      x: string; // 경도
      y: string; // 위도
      address_name: string;
    }

    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: GeocoderResult[], status: Status) => void,
      ): void;
    }
  }
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
