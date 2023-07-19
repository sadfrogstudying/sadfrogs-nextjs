import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/UI/Form";
import { Input } from "~/components/UI/Input";
import { Separator } from "~/components/UI/Seperator";

import type { StudySpotInputV2 } from "~/schemas/study-spots";
import LocationSearchInput from "~/components/LocationSearch";
import type { PlaceResultPicked } from "~/types/GoogleTypes";

interface Props {
  form: UseFormReturn<StudySpotInputV2>;
}

const CreateFormInputsLocation = ({ form }: Props) => {
  const onSelectedPlaceReady = (place: PlaceResultPicked) => {
    const { place_id, address_components, formatted_address, geometry } = place;

    address_components?.forEach((address) => {
      if (address.types.includes("locality"))
        form.setValue("city", address.long_name);
      if (address.types.includes("country"))
        form.setValue("country", address.long_name);
      if (address.types.includes("administrative_area_level_1"))
        form.setValue("state", address.long_name);
    });
    form.setValue("placeId", place_id);
    form.setValue("latitude", geometry?.location?.lat());
    form.setValue("longitude", geometry?.location?.lng());
    form.setValue("address", formatted_address);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Location"
        description="Information about the location."
      />

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
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

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <Separator className="mt-4" />
      </div>
    </>
  );
};
