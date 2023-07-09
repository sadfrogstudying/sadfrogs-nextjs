import React, { useState, useEffect, useCallback } from "react";

import type { Image as ImageType } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";

import Image from "../../UI/Image";
import { Thumb } from "./CarouselThumb";
import { VerticalThumb } from "./VerticalCarouselThumb";

type PropType = {
  images: ImageType[];
  name: string;
};

const VerticalCarousel: React.FC<PropType> = (props) => {
  const { images, name } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    axis: "y",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    axis: "y",
    containScroll: "keepSnaps",
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
    <div className="w-96 h-full max-h-screen flex gap-2 p-4">
      <div
        className="overflow-hidden bg-gray-100 w-4/5 rounded"
        ref={emblaMainRef}
      >
        <div
          className="flex flex-col touch-pan-x gap-2"
          style={{ height: "100vh" }}
        >
          {images.map((image, i) => (
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
        className="w-1/5 overflow-hidden bg-gray-100 rounded"
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

// const VerticalCarousel = ({
//   name,
//   images,
// }: {
//   name: string;
//   images: ImageType[];
// }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
//   const currentImage = images[currentImageIndex];

//   return (
//     <div className="w-1/4 flex">
//       <div className="h-96">
//         {currentImage && (
//           <Image
//             image={{ ...currentImage }}
//             alt={`Image of ${name}`}
//             objectFit="cover"
//           />
//         )}
//       </div>
//       <div className="flex flex-col">
//         {images?.map((image) => (
//           <div className="h-full">
//             <Image
//               image={{ ...image }}
//               alt={`Image of ${name}`}
//               objectFit="cover"
//               key={image.url}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VerticalCarousel;
