import Link from "next/link";
import { usePathname } from "next/navigation";

import dynamic from "next/dynamic";
import { Button } from "./UI/Button";
const CreateStudySpotFormSheet = dynamic(
  () => import("~/components/StudySpot/CreateForm/CreateFormSheet"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const Loading = () => (
  <Button variant="outline" disabled>
    Create
  </Button>
);

const Header = () => {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  return (
    <header className="pointer-events-none fixed flex justify-between z-20 w-full rounded top-0 left-0">
      <h1
        className={`pointer-events-auto text-3xl font-serif tracking-tight md:text-4xl flex justify-center items-center p-4 bg-white rounded-md m-0 md:m-4 ${
          isMapPage ? "md:invisible" : "visible"
        }`}
      >
        <Link href="/">Sad Frogs Studying</Link>
      </h1>
      <div
        role="menubar"
        className="flex p-4 z-20 gap-4 justify-center items-center font-mono md:m-4 rounded-md"
      >
        <Link href="/about" className="pointer-events-auto h-fit">
          About
        </Link>
        <span className="text-gray-300"> | </span>
        <Link href="/map" className="pointer-events-auto h-fit">
          Map
        </Link>
        <span className="text-gray-300"> | </span>
        <CreateStudySpotFormSheet />
      </div>
    </header>
  );
};

export default Header;
