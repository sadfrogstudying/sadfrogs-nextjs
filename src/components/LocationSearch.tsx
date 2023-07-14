import { Check } from "lucide-react";

import { cn } from "~/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/UI/Command";
import Script from "next/script";
import { env } from "~/env.mjs";
import useGooglePlaces from "~/hooks/useGooglePlaces";

const LocationSearchInput = () => {
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

  return (
    <div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
        onReady={() => {
          setScriptReady(true);
        }}
      />
      <div ref={placesDivRef}></div>
      <div className="w-96 border rounded-md p-2 w-full">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={!libraryReady ? "Loading..." : "Search location..."}
            onValueChange={(val) => onChange(val)}
            value={inputValue}
            disabled={!libraryReady}
          />
          {predictions.length > 0 && (
            <CommandGroup>
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.description}
                  value={prediction.description}
                  onSelect={onSelect}
                >
                  <Check className={cn("mr-2 h-4 w-4")} />
                  {prediction.description}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </div>
    </div>
  );
};

export default LocationSearchInput;
