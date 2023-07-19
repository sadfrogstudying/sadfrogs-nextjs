"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, MapPinIcon } from "lucide-react";

import Script from "next/script";
import { env } from "~/env.mjs";
import useGooglePlaces from "~/hooks/useGooglePlaces";
import Image from "next/image";

import { cn } from "~/lib/utils";
import { Button } from "~/components/UI/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/UI/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/Popover";
import { AutocompletePrediction } from "~/types/GoogleTypes";

interface Props {
  onSelectedPlaceReady: (place: google.maps.places.PlaceResult) => void;
}

const LocationSearchInput = ({ onSelectedPlaceReady }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<AutocompletePrediction>();
  const {
    setScriptReady,
    libraryReady,
    placesDivRef,
    onChange,
    onSelect,
    inputValue,
    predictions,
    selectedPlace,
  } = useGooglePlaces();

  useEffect(() => {
    if (selectedPlace) onSelectedPlaceReady(selectedPlace);
  }, [selectedPlace]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
        onReady={() => {
          setScriptReady(true);
        }}
      />
      <div ref={placesDivRef}></div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedPlace ? (
              <span className="flex truncate items-center">
                <MapPinIcon className={cn("mr-2 h-4 w-4 shrink-0")} />
                <strong className="mr-2">
                  {value?.structured_formatting.main_text}
                </strong>
                <span className="truncate font-normal">
                  {value?.structured_formatting.secondary_text}
                </span>
              </span>
            ) : (
              "Search Location..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={!libraryReady ? "Loading..." : "Search location..."}
              onValueChange={(val) => onChange(val)}
              value={inputValue}
              disabled={!libraryReady}
            />
            <CommandEmpty>No locations found.</CommandEmpty>
            {predictions.length > 0 && (
              <CommandGroup>
                {predictions.map((prediction) => (
                  <CommandItem
                    key={prediction.description}
                    value={prediction.description}
                    onSelect={(desc) => {
                      setValue(prediction);
                      onSelect(desc);
                      setOpen(false);
                    }}
                    className="truncate"
                  >
                    <MapPinIcon
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        prediction.place_id === value?.place_id
                          ? "opacity-100"
                          : "opacity-20"
                      )}
                    />
                    <strong className="mr-2">
                      {prediction.structured_formatting.main_text}
                    </strong>
                    <div className="truncate">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </CommandItem>
                ))}
                <Image
                  src="/powered_by_google.png"
                  alt="Powered by Google"
                  width="120"
                  height="14"
                  className="pt-4 pb-2 mr-2 ml-auto"
                />
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default LocationSearchInput;
