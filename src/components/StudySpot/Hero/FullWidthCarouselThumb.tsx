import React from "react";
import Image from "~/components/UI/Image";
import type { Image as ImageType } from "~/schemas/study-spots";

type PropType = {
  selected: boolean;
  image: ImageType;
  index: number;
  onClick: () => void;
  name: string;
};

export const FullWidthCarouselThumb: React.FC<PropType> = (props) => {
  const { selected, image, onClick, name } = props;

  const opacity = {
    0: "opacity-50",
    100: "opacity-100",
  };
  const thumbOpacity = selected ? opacity[100] : opacity[0];

  return (
    <button
      onClick={onClick}
      className={`touch-manipulation relative ${thumbOpacity} flex touch-pan-y h-full`}
      type="button"
      style={{
        aspectRatio: image.aspectRatio,
      }}
    >
      <Image
        image={{ ...image }}
        alt={`Image of ${name}`}
        objectFit="cover"
        key={image.url}
        className="rounded overflow-hidden"
        sizes="(max-width: 639px) 16vw, (max-width: 1030px) 10vw, (max-width: 1500px) 8vw, 6vw"
      />
    </button>
  );
};
