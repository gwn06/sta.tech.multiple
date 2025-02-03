import { Suspense } from "react";
import FileUploadButton from "./file-upload";
import SortingGroupContainer from "./sorting-group-container";
import GridPhotos from "./grid-photos";

export interface DriveImage {
    id: number;
    name: string;
    image_url: string;
    image_path: string;
    user_id: string;
    inserted_at: string;
}

export interface DriveLiteProps {
    images: Promise<DriveImage[]>;
    userId: string;
}

export default function DriveLite({ images, userId }: DriveLiteProps) {
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex justify-end items-center md:mx-36">
          <SortingGroupContainer sortByRowName="inserted_at" />
          <FileUploadButton userId={userId} />
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex justify-center max-h-[300px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
            <GridPhotos imagesPromise={images} />
        </div>
      </Suspense>
    </div>
  );
}
