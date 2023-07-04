import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/UI/Card";
import CreateStudySpotForm from "~/components/Form/CreateStudySpot";

const CreateStudySpotFormCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Study Spot</CardTitle>
        <CardDescription>Add a new study spot to SadFrogs ✍️.</CardDescription>
      </CardHeader>
      <CreateStudySpotForm />
    </Card>
  );
};

export default CreateStudySpotFormCard;
