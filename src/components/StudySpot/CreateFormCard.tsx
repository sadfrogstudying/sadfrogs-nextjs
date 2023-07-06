import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/UI/Card";
import CreateStudySpotForm from "~/components/StudySpot/CreateForm";

const CreateStudySpotFormCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Study Spot</CardTitle>
        <CardDescription>Add a new study spot to SadFrogs ✍️.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateStudySpotForm />
      </CardContent>
    </Card>
  );
};

export default CreateStudySpotFormCard;
