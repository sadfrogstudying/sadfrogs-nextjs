import type { SetValueConfig, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSectionHeader,
} from "~/components/UI/Form";
import { Input } from "~/components/UI/Input";

import type { StudySpotInputV2 } from "~/schemas/study-spots";
import LocationSearchInput from "~/components/LocationSearch";
import type { PlaceResultPicked } from "~/types/GoogleTypes";

interface Props {
  form: UseFormReturn<StudySpotInputV2>;
}

const CreateFormInputsLocation = ({ form }: Props) => {
  const onSelectedPlaceReady = (place: PlaceResultPicked) => {
    const { place_id, address_components, formatted_address, geometry } = place;

    const setValueOptions: SetValueConfig = {
      shouldTouch: true,
    };

    address_components?.forEach((address) => {
      if (address.types.includes("locality"))
        form.setValue("city", address.long_name);
      if (address.types.includes("country"))
        form.setValue("country", address.long_name);
      if (address.types.includes("administrative_area_level_1"))
        form.setValue("state", address.long_name);
    });
    form.setValue("placeId", place_id, setValueOptions);
    form.setValue("latitude", geometry?.location?.lat(), setValueOptions);
    form.setValue("longitude", geometry?.location?.lng(), setValueOptions);
    form.setValue("address", formatted_address, setValueOptions);
  };

  return (
    <div className="space-y-8">
      <FormSectionHeader title="Location" />

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <LocationSearchInput
                  onSelectedPlaceReady={onSelectedPlaceReady}
                />
              </FormControl>
              <FormDescription>
                You can use this input to assist in filling location details.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter placeId" {...field} />
              </FormControl>
              <FormDescription>
                This is the unique identifier for the location.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter latitude"
                    {...field}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter longitude"
                    {...field}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFormInputsLocation;
