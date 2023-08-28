import dynamic from "next/dynamic";

import type { SetValueConfig, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/UI/Form";
import { Input } from "~/components/UI/Input";

import type { StudySpotFormInputs } from "~/schemas/study-spots";
import { Button } from "~/components/UI/Button";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { PlaceResultPicked } from "~/types/GoogleTypes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/UI/Collapsible";
import { useCallback, useState } from "react";
import { Separator } from "~/components/UI/Seperator";

const LocationSearchInput = dynamic(
  () => import("~/components/LocationSearch"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const Loading = () => (
  <Button
    variant="outline"
    className="w-full justify-between bg-gray-100 text-lg sm:text-sm"
    disabled
  >
    Loading...
    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  </Button>
);

interface Props {
  form: UseFormReturn<StudySpotFormInputs>;
}

const StudySpotInputsLocation = ({ form }: Props) => {
  const onSelectedPlaceReady = useCallback(
    (place: PlaceResultPicked) => {
      const {
        place_id,
        address_components,
        formatted_address,
        geometry,
        website,
      } = place;

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

      const formVals = form.getValues();

      form.setValue("placeId", place_id, setValueOptions);
      form.setValue("latitude", geometry?.location?.lat(), setValueOptions);
      form.setValue("longitude", geometry?.location?.lng(), setValueOptions);
      form.setValue("address", formatted_address, setValueOptions);
      formVals.website === "" &&
        form.setValue("website", website, setValueOptions);
    },
    [form]
  );

  const [open, setOpen] = useState(false);

  return (
    <Collapsible className="space-y-8" open={open}>
      <CollapsibleTrigger
        className="w-full text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h3 className="text-2xl font-bold mb-1 flex gap-4">
            Location {open ? <ChevronUp /> : <ChevronDown />}
          </h3>
          <p className="text-sm text-muted-foreground">Optional Information</p>
          <Separator className="mt-3" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-8">
        <div className="space-y-2">
          <div className="text-sm">Location</div>
          <LocationSearchInput onSelectedPlaceReady={onSelectedPlaceReady} />
          <div className="text-sm text-muted-foreground">
            You can use this input to assist in filling location details.
          </div>
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    step="any"
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
                    step="any"
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default StudySpotInputsLocation;
