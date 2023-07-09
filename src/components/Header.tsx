import Link from "next/link";
import CreateStudySpotFormSheet from "~/components/StudySpot/CreateFormSheet";

const Header = () => {
  return (
    <>
      <header className="w-full bg-gray-100 fixed flex p-4 z-20 md:w-auto md:bg-white rounded">
        <Link href="/">
          <h1 className="text-2xl font-serif font-normal tracking-tight md:text-4xl">
            Sad Frogs Studying
          </h1>
        </Link>
      </header>
      <div role="menubar" className="flex fixed top-0 right-0 p-4 z-20">
        <CreateStudySpotFormSheet />
      </div>
    </>
  );
};

export default Header;
