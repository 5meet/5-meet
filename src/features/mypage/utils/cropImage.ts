import type { Area } from "react-easy-crop";

const OUTPUT_SIZE = 512;
const OUTPUT_TYPE = "image/jpeg";
const OUTPUT_QUALITY = 0.9;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    if (src.startsWith("http")) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("크롭된 이미지를 생성하지 못했습니다."));
      },
      OUTPUT_TYPE,
      OUTPUT_QUALITY,
    );
  });
}

export async function createCroppedImageFile(
  imageSrc: string,
  crop: Area,
) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지 편집을 지원하지 않는 브라우저입니다.");
  }

  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );

  const blob = await canvasToBlob(canvas);

  return new File([blob], `profile-${Date.now()}.jpg`, {
    type: OUTPUT_TYPE,
  });
}
