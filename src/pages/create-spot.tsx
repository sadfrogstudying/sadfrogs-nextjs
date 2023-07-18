import CreateStudySpotForm from "~/components/StudySpot/CreateForm";
import { Separator } from "~/components/UI/Seperator";

const CreateSpotPage = () => {
  return (
    <div className="p-4 pt-36">
      <section className="max-w-2xl m-auto border rounded-md p-8">
        <div className="space-y-0.5 p-30">
          <h2 className="text-2xl font-bold tracking-tight">Create New Spot</h2>
          <p className="text-muted-foreground">Create a new study spot.</p>
        </div>
        <Separator className="my-6" />
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">General</h3>
            <p className="text-sm text-muted-foreground">
              This section must be filled out.
            </p>
          </div>
          <Separator />
          <CreateStudySpotForm />
        </div>
      </section>
    </div>
  );
};
export default CreateSpotPage;
