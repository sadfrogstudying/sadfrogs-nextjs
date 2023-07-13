import { useEffect, useRef, useState } from "react";
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

type CachedData = Record<
  string,
  { data: AutocompletePrediction[]; maxAge: number }
>;

const cacheKey = "sfgpk"; // Key to identify our data in sessionStorage
const cache = 0.25 * 60 * 60; // 15 minutes in seconds

const getCachedData = (): CachedData => {
  return JSON.parse(sessionStorage.getItem(cacheKey) || "{}");
};

const LocationSearchAutoComplete = () => {
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResultPicked | null>(
    null
  );

  const [scriptReady, setScriptReady] = useState(false);
  const [libraryReady, setLibraryReady] = useState(false);

  const serviceAutocomplete = useRef<AutocompleteService>();
  const servicePlaces = useRef<PlacesService>();
  const sessionToken = useRef<AutocompleteSessionToken | null>(null);

  const placesDivRef = useRef<HTMLDivElement>(null); // need to figure out what this is for

  const refreshSessionToken = () => {
    sessionToken.current = new google.maps.places.AutocompleteSessionToken();
  };

  useEffect(() => {
    if (!scriptReady || !placesDivRef.current) return;

    serviceAutocomplete.current =
      new window.google.maps.places.AutocompleteService();
    servicePlaces.current = new window.google.maps.places.PlacesService(
      placesDivRef.current
    );

    refreshSessionToken();

    setLibraryReady(true);
  }, [scriptReady]);

  const getPredictions = useDebounce(() => {
    if (!serviceAutocomplete.current || !sessionToken.current) return;

    void serviceAutocomplete.current.getPlacePredictions(
      { sessionToken: sessionToken.current, input: inputValue },
      (predictions, status) => {
        if (status !== "OK") return alert(status);

        setPredictions(predictions || []);

        // adding new predictions to cache
        const cachedData = getCachedData();
        cachedData[inputValue] = {
          data: predictions || [],
          maxAge: Date.now() + cache * 1000,
        };
        sessionStorage.setItem(cacheKey, JSON.stringify(cachedData));
      }
    );
  });

  const onChange = (val: string) => {
    setInputValue(val);

    if (val === "") return setPredictions([]);

    // check cache
    const cachedData = getCachedData();
    // remove expired cached data
    const reducedCachedData = Object.keys(cachedData).reduce(
      (acc: CachedData, key) => {
        const entry = cachedData[key];
        if (entry && entry.maxAge - Date.now() >= 0) acc[key] = entry;
        return acc;
      },
      {} as CachedData
    );
    const cachedPredictions = reducedCachedData[val]?.data || null;
    if (cachedPredictions) return setPredictions(cachedPredictions);

    // if not in cache, send request
    getPredictions();
  };

  const onSelect = (desc: string) => {
    const selectedPlaceId = predictions.find(
      (p) => p.description.toLowerCase().trim() === desc
    )?.place_id;

    const confirmed = confirm(
      "Do you want to getDetails and complete the session?"
    );

    if (
      !confirmed ||
      !selectedPlaceId ||
      !servicePlaces.current ||
      !sessionToken.current
    )
      return;

    return servicePlaces.current.getDetails(
      {
        sessionToken: sessionToken.current,
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
        if (status !== "OK") return alert(status);
        setSelectedPlace(place);
        refreshSessionToken();
      }
    );
  };

  return (
    <div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
        onReady={() => {
          setScriptReady(true);
        }}
      />
      <div ref={placesDivRef}></div>
      <div className="w-96 border rounded p-2">
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

export default LocationSearchAutoComplete;
