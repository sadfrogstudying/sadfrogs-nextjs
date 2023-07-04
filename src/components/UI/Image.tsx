import { useState } from "react";
import styled from "@emotion/styled";
import type { Image as PrismaImageType } from "@prisma/client";
import FutureImage from "next/image";
import { transientOptions } from "~/utils/helpers";

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

  return (
    <ImageContainer>
      {placeholder === "empty" && (
        <DominantColor
          $loaded={imageLoaded}
          style={{
            aspectRatio: aspectRatio,
            backgroundColor: dominantColour,
          }}
        />
      )}
      <FutureImageStyled
        src={url}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={doFadeIn}
        $loaded={placeholder === "blur" ? true : imageLoaded}
        $objectFit={objectFit}
        onClick={onClick}
        placeholder={placeholder}
        quality={quality || undefined}
      />
    </ImageContainer>
  );
};

export default Image;

const ImageContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
const FutureImageStyled = styled(FutureImage, transientOptions)<{
  $loaded: boolean;
  $objectFit: "contain" | "cover";
}>`
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.25s linear;
  object-fit: ${({ $objectFit }) => $objectFit};
  will-change: opacity;
  width: fit-content;
  height: 100%;
  width: 100%;
`;
const DominantColor = styled("div", transientOptions)<{
  $loaded: boolean;
}>`
  opacity: ${({ $loaded }) => ($loaded ? 0 : 1)};
  transition: opacity 500ms linear 0s;
  position: absolute;
  inset: 0px;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
`;
