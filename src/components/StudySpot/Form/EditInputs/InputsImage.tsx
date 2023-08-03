import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormSectionHeader,
} from "~/components/UI/Form";
import FileInput from "~/components/UI/FileInput";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/UI/Dialog";

import type {
  Image as ImageType,
  PendingEditFormInputs,
} from "~/schemas/study-spots";
import { Button } from "~/components/UI/Button";

import Image from "~/components/UI/Image";
import { useState } from "react";
import { Trash } from "lucide-react";
import { ScrollArea } from "~/components/UI/ScrollArea";

interface Props {
  form: UseFormReturn<PendingEditFormInputs>;
  existingImages: ImageType[];
}

const StudySpotInputsImage = ({ form, existingImages }: Props) => {
  return (
    <div className="space-y-8">
      <FormSectionHeader
        title="Image"
        description="Please add at least one image"
      />

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <FileInput
                  isSuccess={false}
                  setValue={(files) => form.setValue("images", files)}
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <EditImages existingImages={existingImages} form={form} />
      </div>
    </div>
  );
};

export default StudySpotInputsImage;

const EditImages = ({
  existingImages,
  form,
}: {
  existingImages?: ImageType[];
  form: UseFormReturn<PendingEditFormInputs>;
}) => {
  const [open, setOpen] = useState(false);
  const imagesToDelete = form.watch("imagesToDelete") || [];

  const addImageToDelete = (id: number) => {
    form.setValue("imagesToDelete", [...imagesToDelete, id]);
  };
  const removeImageToDelete = (id: number) => {
    const newArr = imagesToDelete.filter((x) => x !== id);
    form.setValue("imagesToDelete", [...newArr]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Change Existing Images</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px] font-mono">
          <DialogHeader>
            <DialogTitle className="text-2xl">Delete Images</DialogTitle>
            <DialogDescription>
              Select the existing images you wish to delete here
            </DialogDescription>
          </DialogHeader>
          {existingImages && (
            <ScrollArea className="h-96 border rounded-md">
              <div className="grid grid-cols-2 gap-2 h-96 p-4 md:grid-cols-3">
                {existingImages.map((image) => (
                  <div className="relative" key={image.url}>
                    <Button
                      variant={
                        imagesToDelete.includes(image.id)
                          ? "destructive"
                          : "secondary"
                      }
                      className="absolute top-2 left-2 z-50 h-8 w-8"
                      onClick={() => {
                        imagesToDelete.includes(image.id)
                          ? removeImageToDelete(image.id)
                          : addImageToDelete(image.id);
                      }}
                    >
                      <Trash className="h-3 w-3 shrink-0" />
                    </Button>
                    <Image
                      image={image}
                      alt={`Photo of ${image.url}`}
                      className={`w-full rounded overflow-hidden relative h-auto ${
                        imagesToDelete.includes(image.id)
                          ? "opacity-50 outline outline-red-600"
                          : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
