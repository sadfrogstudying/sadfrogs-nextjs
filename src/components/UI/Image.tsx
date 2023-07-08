import { useState } from "react";
import type { Image as PrismaImageType } from "@prisma/client";
import FutureImage from "next/image";

type ImageType = Omit<PrismaImageType, "id" | "studySpotId">;

interface Props {
  image: ImageType;
  alt: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  objectFit?: "contain" | "cover";
  onClick?: () => void;
}

/*
 * Default placeholder is "empty" which uses dominantColor
 * Blurred doesn't fade in, which isn't nice
 */

const Image = ({
  image,
  alt,
  quality,
  placeholder = "empty",
  objectFit = "contain",
  onClick,
}: Props) => {
  const { aspectRatio, dominantColour, height, url, width } = image;
  const [imageLoaded, setImageLoaded] = useState(false);
  const doFadeIn = () => setImageLoaded(true);

  const opacity = {
    0: "opacity-0",
    100: "opacity-100",
  };

  const imageOpacity = imageLoaded ? opacity[100] : opacity[0];
  const placeholderOpacity = imageLoaded ? opacity[0] : opacity[100];

  return (
    <div
      className="relative h-full w-full"
      style={{
        aspectRatio: aspectRatio,
      }}
    >
      {placeholder === "empty" && (
        <div
          className={`${placeholderOpacity} absolute inset-0 z-10 ease-in duration-500 opacity-20`}
          style={{
            aspectRatio: aspectRatio,
            backgroundColor: dominantColour,
          }}
        />
      )}
      <FutureImage
        src={url}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={doFadeIn}
        onClick={onClick}
        placeholder={placeholder}
        quality={quality || undefined}
        className={`w-fit h-full ${imageOpacity} object-${objectFit} ease-out duration-500`}
      />
    </div>
  );
};

export default Image;
