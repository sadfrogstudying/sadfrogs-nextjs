import { type InfiniteData } from "@tanstack/react-query";
import { type GetNotValidatedOutput } from "~/schemas/study-spots";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/UI/Table";
import Link from "next/link";
import Image from "../UI/Image";

const StudySpotList = ({
  data,
  status,
}: {
  data: InfiniteData<GetNotValidatedOutput> | undefined;
  status: "error" | "loading" | "success";
}) => {
  return (
    <>
      {status !== "loading" && (
        <Table className="relative font-mono text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] min-w-[100px]">Image</TableHead>
              <TableHead className="w-[200px] min-w-[200px]">Name</TableHead>
              <TableHead className="w-[250px] min-w-[250px]">Address</TableHead>
              <TableHead className="w-[100px]">Wifi</TableHead>
              <TableHead className="w-[100px]">Music</TableHead>
              <TableHead className="w-[100px]">Power Outlets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages.map((page) =>
              page.map((studySpot, i) => (
                <TableRow key={studySpot.address + studySpot.name + i}>
                  <TableCell>
                    {studySpot.images[0] && (
                      <Link
                        tabIndex={-1}
                        href={`/study-spot/${studySpot.slug}`}
                        className="block relative w-[100px] h-fit rounded-md"
                      >
                        <Image
                          image={{ ...studySpot.images[0] }}
                          key={studySpot.images[0].url}
                          alt={`Image of ${studySpot.name}`}
                          className="rounded-md overflow-hidden"
                          sizes="100px"
                        />
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>{studySpot.name}</TableCell>
                  <TableCell className="w-[250px]">
                    {studySpot.address}
                  </TableCell>
                  <TableCell>{studySpot.wifi ? "Yes" : "No"}</TableCell>
                  <TableCell>{studySpot.music ? "Yes" : "No"}</TableCell>
                  <TableCell>{studySpot.powerOutlets ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default StudySpotList;
