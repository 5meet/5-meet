// types/kakao-maps.d.ts
export {};

declare global {
  namespace kakao.maps {
    class LatLng {
      constructor(lat: number, lng: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    class Size {
      constructor(width: number, height: number);
    }

    interface MapOptions {
      center: LatLng;
      level?: number;
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      panTo(latlng: LatLng): void;
      relayout(): void;
    }

    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      image?: MarkerImage;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }

    class MarkerImage {
      constructor(src: string, size: Size, options?: { offset?: Point });
    }

    class InfoWindow {
      constructor(options: { content: string });
      open(map: Map, marker: Marker): void;
    }

    function load(callback: () => void): void;

    namespace event {
      function addListener(
        target: Marker,
        type: string,
        handler: () => void,
      ): void;
    }

    namespace services {
      enum Status {
        OK = "OK",
        ZERO_RESULT = "ZERO_RESULT",
        ERROR = "ERROR",
      }

      interface GeocoderResult {
        x: string;
        y: string;
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

  interface Window {
    kakao: typeof kakao;
  }
}
