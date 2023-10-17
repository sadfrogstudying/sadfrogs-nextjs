import { type Dispatch, type SetStateAction } from "react";

import { Button } from "~/components/UI/Button";

import { Checkbox } from "~/components/UI/Checkbox";
import { Grid, List, Star } from "lucide-react";

interface Filters {
  powerOutlets: boolean;
  wifi: boolean;
}

const Controls = ({
  filters,
  setFilters,
  setAppliedFilters,
  listView,
  setListView,
  isLoading,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  setAppliedFilters: Dispatch<SetStateAction<Filters>>;
  setListView: Dispatch<SetStateAction<boolean>>;
  listView: boolean;
  isLoading: boolean;
}) => {
  return (
    <div className="md:sticky md:pt-32 top-0 py-8 w-full md:w-60 md:h-screen z-10 font-mono flex-wrap rounded-md flex-shrink-0 text-sm">
      <div className="w-full p-4 rounded-md flex flex-col items-start justify-start gap-4 shadow-lg">
        <div className="space-y-2 w-full">
          <h3 className="text-base font-bold">Display View:</h3>
          <Button
            onClick={() => setListView((prev) => !prev)}
            className="bg-orange-500 hover:bg-orange-600 w-full"
          >
            {listView ? (
              <>
                <Grid className="p-0.5 mr-2" />
                Grid
              </>
            ) : (
              <>
                <List className="p-0.5 mr-2" />
                List
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2 w-full">
          <h3 className="text-base font-bold">Filters:</h3>
          <div className="flex items-center gap-8 bg-gray-100 p-2 justify-between">
            <label htmlFor="poweroutlets">Power Outlets:</label>
            <Checkbox
              id="poweroutlets"
              checked={filters.powerOutlets}
              onCheckedChange={(x) =>
                setFilters({
                  ...filters,
                  powerOutlets: x === "indeterminate" ? true : x,
                })
              }
            />
          </div>

          <div className="flex items-center gap-8 bg-gray-100 p-2 justify-between">
            <label htmlFor="wifi">Wifi:</label>
            <Checkbox
              id="wifi"
              checked={filters.wifi}
              onCheckedChange={(x) =>
                setFilters({
                  ...filters,
                  wifi: x === "indeterminate" ? true : x,
                })
              }
            />
          </div>

          <Button
            onClick={() => setAppliedFilters(filters)}
            disabled={isLoading}
            className="w-full"
          >
            <span className={`${isLoading ? "opacity-0" : ""}`}>Apply</span>
            {isLoading && (
              <Star className="absolute p-1 animate-spin" fill="#fff" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
