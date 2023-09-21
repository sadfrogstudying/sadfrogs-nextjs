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
    <div className="font-mono flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
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

      <div className="flex gap-4">
        <Button onClick={() => setAppliedFilters(filters)} disabled={isLoading}>
          <span className={`${isLoading ? "opacity-0" : ""}`}>Apply</span>
          {isLoading && (
            <Star className="absolute p-1 animate-spin" fill="#fff" />
          )}
        </Button>

        <Button
          onClick={() => setListView((prev) => !prev)}
          className="bg-orange-500 hover:bg-orange-600"
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
    </div>
  );
};

export default Controls;
