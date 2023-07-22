import React, { useState, useEffect, useCallback } from "react";

import type { Image as ImageType } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";

import Image from "../../UI/Image";
import { FullWidthCarouselThumb } from "./FullWidthCarouselThumb";

type PropType = {
  images: ImageType[];
  name: string;
};

const FullWidthHeroCarousel: React.FC<PropType> = (props) => {
  const { images, name } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel();
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const animatePulse = images.length === 0 ? "animate-pulse" : "";

  return (
    <div className="w-full h-fit p-4">
      <div
        className={`overflow-hidden bg-muted rounded ${animatePulse}`}
        ref={emblaMainRef}
      >
        <div className="flex touch-pan-y h-96 gap-2 cursor-grab active:cursor-grabbing">
          {images.map((image) => (
            <div className="relative w-fit h-full rounded-md" key={image.id}>
              <Image
                image={{ ...image }}
                alt={`Image of ${name}`}
                objectFit="cover"
                key={image.url}
                className="rounded overflow-hidden"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`mt-2 overflow-hidden bg-muted rounded ${animatePulse}`}
        ref={emblaThumbsRef}
      >
        <div className="flex touch-pan-y h-24 gap-2">
          {images.map((image, i) => (
            <FullWidthCarouselThumb
              key={image.id}
              onClick={() => onThumbClick(i)}
              selected={i === selectedIndex}
              index={i}
              image={image}
              name={name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullWidthHeroCarousel;
