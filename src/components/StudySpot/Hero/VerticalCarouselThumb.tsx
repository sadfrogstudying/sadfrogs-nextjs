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

export const VerticalThumb: React.FC<PropType> = (props) => {
  const { selected, image, onClick, name } = props;

  const opacity = {
    0: "opacity-50",
    100: "opacity-100",
  };
  const thumbOpacity = selected ? opacity[100] : opacity[0];

  return (
    <button
      onClick={onClick}
      className={`touch-manipulation w-full ${thumbOpacity} rounded overflow-hidden`}
      type="button"
    >
      <Image
        image={{ ...image }}
        alt={`Image of ${name}`}
        objectFit="cover"
        key={image.url}
      />
    </button>
  );
};
