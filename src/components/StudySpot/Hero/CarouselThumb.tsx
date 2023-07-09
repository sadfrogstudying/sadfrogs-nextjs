import type { Image as ImageType } from "@prisma/client";
import React from "react";
import Image from "~/components/UI/Image";

type PropType = {
  selected: boolean;
  image: ImageType;
  index: number;
  onClick: () => void;
  name: string;
};

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, image, index, onClick, name } = props;

  const opacity = {
    0: "opacity-50",
    100: "opacity-100",
  };
  const thumbOpacity = selected ? opacity[100] : opacity[0];

  return (
    <div
      className="relative h-full w-full"
      style={{
        aspectRatio: image.aspectRatio,
      }}
    >
      <button
        onClick={onClick}
        className={`touch-manipulation w-full ${thumbOpacity}`}
        type="button"
      >
        <Image
          image={{ ...image }}
          alt={`Image of ${name}`}
          objectFit="cover"
          key={image.url}
        />
      </button>
    </div>
  );
};
