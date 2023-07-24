import Link from "next/link";

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
  return (
    <>
      <header className="fixed flex p-4 z-20 md:w-auto md:bg-white rounded top-4 left-4">
        <Link href="/">
          <h1 className="text-2xl font-serif tracking-tight md:text-4xl">
            Sad Frogs Studying
          </h1>
        </Link>
      </header>
      <div
        role="menubar"
        className="flex fixed top-0 right-0 p-4 z-20 gap-4 justify-center items-center font-mono"
      >
        <Link href="/about" className="h-fit">
          About
        </Link>
        <span className="text-gray-300"> | </span>
        <Link href="/map" className="h-fit">
          Map
        </Link>
        <span className="text-gray-300"> | </span>
        <CreateStudySpotFormSheet />
      </div>
    </>
  );
};

export default Header;
