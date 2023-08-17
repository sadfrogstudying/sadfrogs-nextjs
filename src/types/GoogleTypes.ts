type AutocompletePrediction = google.maps.places.AutocompletePrediction;
type AutocompleteService = google.maps.places.AutocompleteService;
type AutocompleteSessionToken = google.maps.places.AutocompleteSessionToken;
type PlacesService = google.maps.places.PlacesService;
type PlaceResult = google.maps.places.PlaceResult;
type PlaceResultPicked = Pick<
  PlaceResult,
  | "place_id"
  | "address_components"
  | "opening_hours"
  | "formatted_address"
  | "geometry"
  //   | "name"
  //   | "opening_hours"
  | "website"
>;
type PlacesServiceStatus = google.maps.places.PlacesServiceStatus;

type CachedData = Record<
  string,
  { data: AutocompletePrediction[]; maxAge: number }
>;

export type {
  AutocompletePrediction,
  AutocompleteService,
  AutocompleteSessionToken,
  PlacesService,
  PlaceResultPicked,
  PlacesServiceStatus,
  CachedData,
};
