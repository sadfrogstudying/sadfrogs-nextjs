import React, { useState, useEffect, useCallback } from "react";

import useEmblaCarousel from "embla-carousel-react";

import Image from "../../UI/Image";
import { FullWidthCarouselThumb } from "./FullWidthCarouselThumb";
import type { Image as ImageType } from "~/schemas/study-spots";

import { ChevronRightSquare } from "lucide-react";
import { default as NextLink } from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/Popover";

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
        className={`overflow-hidden bg-muted rounded-md ${animatePulse}`}
        ref={emblaMainRef}
      >
        <div className="flex touch-pan-y h-96 gap-2 cursor-grab active:cursor-grabbing">
          {images.map((image) => (
            <div
              className="relative w-fit h-full cursor-pointer"
              key={image.id}
            >
              <AuthorTooltip username={image.author?.username} />
              <Image
                useAspectRatio
                image={{ ...image }}
                alt={`Image of ${name}`}
                objectFit="cover"
                key={image.url}
                className="rounded-md overflow-hidden"
                sizes="300px"
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

const AuthorTooltip = ({ username }: { username?: string }) => {
  if (!username) return null;

  return (
    <Popover>
      <PopoverTrigger className="p-2 opacity-70 absolute bottom-2 right-2 rounded-md bg-lime-300 text-black font-mono z-20 active:opacity-100 text-sm animate-fade-in-70">
        Author
      </PopoverTrigger>
      {/* <PopoverContent>Place content for the popover here.</PopoverContent> */}
      <PopoverContent className="p-2 bg-lime-300 text-black font-mono text-sm w-full">
        <NextLink
          href={`/user/${username}`}
          className="flex gap-4 items-center hover:text-red-500"
        >
          <span>
            Uploaded by <strong>{username}</strong>
          </span>
          <ChevronRightSquare className="h-4 w-4" />
        </NextLink>
      </PopoverContent>
    </Popover>
  );
};
