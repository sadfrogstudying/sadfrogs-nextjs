import CreateStudySpotFormSheet from "~/components/StudySpot/CreateStudySpotFormSheet";

const Header = () => {
  return (
    <>
      <header className="fixed flex p-4 z-10">
        <h1 className="text-4xl font-serif font-normal tracking-tight">
          Sad Frogs Studying
        </h1>
      </header>
      <div role="menubar" className="flex fixed top-0 right-0 p-4">
        <CreateStudySpotFormSheet />
      </div>
    </>
  );
};

export default Header;
