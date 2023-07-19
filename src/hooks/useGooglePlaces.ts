import { useEffect, useRef, useState } from "react";

import useDebounce from "~/hooks/useDebounce";

import type {
  AutocompletePrediction,
  AutocompleteService,
  AutocompleteSessionToken,
  PlacesService,
  PlaceResultPicked,
  CachedData,
} from "~/types/GoogleTypes";

const cacheKey = "sfgpk"; // Key to identify our data in sessionStorage
const cacheMaxAge = 0.25 * 60 * 60; // 15 minutes in seconds

const getCachedData = (): CachedData => {
  return JSON.parse(sessionStorage.getItem(cacheKey) || "{}") as CachedData;
};

const useGooglePlaces = () => {
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
          maxAge: Date.now() + cacheMaxAge * 1000,
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

    if (!selectedPlaceId || !servicePlaces.current || !sessionToken.current)
      return;

    if (selectedPlaceId === selectedPlace?.place_id) return; // same place was selected

    return servicePlaces.current.getDetails(
      {
        sessionToken: sessionToken.current,
        placeId: selectedPlaceId,
        fields: [
          "place_id",
          "address_components",
          "opening_hours",
          "formatted_address",
          "geometry",
          // "name",
          // "opening_hours",
          // "website",
        ],
      },
      (place, status) => {
        if (status !== "OK") return alert(status);
        setSelectedPlace(place);
        refreshSessionToken();
      }
    );
  };

  return {
    setScriptReady,
    libraryReady,
    placesDivRef,
    onChange,
    onSelect,
    inputValue,
    predictions,
    selectedPlace,
  };
};

export default useGooglePlaces;
