import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/UI/card";
import CreateStudySpotForm from "~/components/Form/CreateStudySpotV2";

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
