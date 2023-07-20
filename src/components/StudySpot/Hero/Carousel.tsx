import React, { useState, useEffect, useCallback } from "react";

import type { Image as ImageType } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";

import Image from "../../UI/Image";
import { Thumb } from "./CarouselThumb";

type PropType = {
  images: ImageType[];
  name: string;
};

const HeroCarousel: React.FC<PropType> = (props) => {
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

  return (
    <div className="w-full h-fit p-4">
      <div className="overflow-hidden" ref={emblaMainRef}>
        <div className="flex touch-pan-y">
          {images.map((image) => (
            <div
              className="relative"
              style={{ flex: `0 0 100%` }}
              key={image.id}
            >
              <Image
                image={{ ...image }}
                alt={`Image of ${name}`}
                objectFit="cover"
                key={image.url}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div className="flex touch-pan-y h-28">
            {images.map((image, i) => (
              <Thumb
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
    </div>
  );
};

export default HeroCarousel;
