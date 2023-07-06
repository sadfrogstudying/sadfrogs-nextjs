import CreateStudySpotFormSheet from "~/components/StudySpot/CreateFormSheet";

const Header = () => {
  return (
    <>
      <header className="fixed flex p-4 z-20">
        <h1 className="text-4xl font-serif font-normal tracking-tight">
          Sad Frogs Studying
        </h1>
      </header>
      <div role="menubar" className="flex fixed top-0 right-0 p-4 z-20">
        <CreateStudySpotFormSheet />
      </div>
    </>
  );
};

export default Header;
