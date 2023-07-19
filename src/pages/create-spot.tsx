import CreateStudySpotForm from "~/components/StudySpot/CreateForm";
import { Separator } from "~/components/UI/Seperator";

const CreateSpotPage = () => {
  return (
    <div className="p-4 pt-36">
      <section className="max-w-4xl m-auto border rounded-md p-8">
        <div className="space-y-0.5 p-30">
          <h2 className="text-2xl font-bold tracking-tight">
            Create New Study Spot
          </h2>
        </div>
        <Separator className="my-6" />

        <div className="w-full space-y-4 ml-4">
          <CreateStudySpotForm />
        </div>
      </section>
    </div>
  );
};
export default CreateSpotPage;
