import { useRef, useState } from "react";
import { Button } from "../UI/Button";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "~/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/UI/Command";
import useDebounce from "~/hooks/useDebounce";
import Script from "next/script";
import { env } from "~/env.mjs";

type AutocompletePrediction = google.maps.places.QueryAutocompletePrediction;
type AutocompleteService = google.maps.places.AutocompleteService;
type AutocompleteSessionToken = google.maps.places.AutocompleteSessionToken;
type PlacesService = google.maps.places.PlacesService;
type PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
type PlaceResult = google.maps.places.PlaceResult;
type PlaceResultPicked = Pick<
  PlaceResult,
  | "address_components"
  | "opening_hours"
  | "formatted_address"
  | "geometry"
  | "name"
  | "opening_hours"
  | "website"
>;

export const loadApiErr =
  "💡 use-places-autocomplete: Google Maps Places API library must be loaded. See: https://github.com/wellyshen/use-places-autocomplete#load-the-library";

const LocationSearchAutoComplete = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResultPicked | null>(
    null
  );

  const [scriptReady, setScriptReady] = useState(false);
  const [libraryReady, setLibraryReady] = useState(false);

  const serviceAutocomplete = useRef<AutocompleteService>();
  const servicePlaces = useRef<PlacesService>();
  const sessionToken = useRef<AutocompleteSessionToken | null>(null);

  const placesDivRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!libraryReady || !placesDivRef.current) return;

    serviceAutocomplete.current =
      new window.google.maps.places.AutocompleteService();
    servicePlaces.current = new window.google.maps.places.PlacesService(
      placesDivRef.current
    );
    sessionToken.current = new google.maps.places.AutocompleteSessionToken();
  }, [libraryReady]);

  const debouncedRequest = useDebounce(() => {
    const displaySuggestions = function (
      predictions: AutocompletePrediction[] | null,
      status: PlacesServiceStatus
    ) {
      if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
        return alert(status);
      }

      setPredictions(predictions);
    };

    if (inputValue === "") return setPredictions([]);
    if (!serviceAutocomplete.current) return;

    void serviceAutocomplete.current.getPlacePredictions(
      { input: inputValue },
      displaySuggestions
    );
  });

  const onChange = (val: string) => {
    setInputValue(val);
    debouncedRequest();
  };

  const onSelect = (desc: string) => {
    const selectedPlaceId = predictions.find(
      (p) => p.description.toLowerCase().trim() === desc
    )?.place_id;

    const confirmed = confirm(
      "Do you want to getDetails and complete the session?"
    );

    if (confirmed && selectedPlaceId && servicePlaces.current) {
      return servicePlaces.current.getDetails(
        {
          placeId: selectedPlaceId,
          fields: [
            "address_components",
            "opening_hours",
            "formatted_address",
            "geometry",
            "name",
            "opening_hours",
            "website",
          ],
        },
        (place, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return alert(status);
          }

          setSelectedPlace(place);
        }
      );
    }
  };

  console.log(selectedPlace);

  return (
    <div>
      {scriptReady && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
          onReady={() => {
            setLibraryReady(true);
          }}
        />
      )}
      <Button className="m-2" onClick={() => setScriptReady(true)}>
        setScriptReady
      </Button>
      <div ref={placesDivRef}></div>
      <div className="w-96 border rounded p-2">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search location..."
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

export default LocationSearchAutoComplete;
