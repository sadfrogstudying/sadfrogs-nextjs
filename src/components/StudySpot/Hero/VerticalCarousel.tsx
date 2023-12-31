import React, { useState, useEffect, useCallback } from "react";

import useEmblaCarousel from "embla-carousel-react";

import Image from "../../UI/Image";
import { VerticalThumb } from "./VerticalCarouselThumb";
import type { Image as ImageType } from "~/schemas/study-spots";

type PropType = {
  images: ImageType[];
  name: string;
};

const VerticalCarousel: React.FC<PropType> = (props) => {
  const { images, name } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    axis: "x",
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 768px)": { axis: "y" },
    },
  });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    axis: "x",
    containScroll: "keepSnaps",
    dragFree: true,
    breakpoints: {
      "(min-width: 768px)": { axis: "y" },
    },
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
    <div className="w-full h-full max-h-screen flex gap-2 p-4 md:w-96">
      <div
        className={`w-4/5 overflow-hidden bg-muted rounded ${animatePulse}`}
        ref={emblaMainRef}
      >
        <div
          className="flex flex-row touch-pan-y gap-2 md:touch-pan-x md:flex-col"
          style={{ height: "100vh" }}
        >
          {images.map((image) => (
            <div key={image.url}>
              <Image
                image={{ ...image }}
                alt={`Image of ${name}`}
                objectFit="cover"
                className="rounded overflow-hidden"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`w-1/5 overflow-hidden bg-muted rounded ${animatePulse}`}
        ref={emblaThumbsRef}
      >
        <div className="flex flex-col touch-pan-x gap-2 h-full">
          {images.map((image, i) => (
            <VerticalThumb
              key={`thumb-${image.url}`}
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

export default VerticalCarousel;
