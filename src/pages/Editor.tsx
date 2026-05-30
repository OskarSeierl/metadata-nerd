import {Image} from "../../shared/types/image.ts";
import {ImageLibrary} from "@/components/ImageLibrary.tsx";

interface EditorProps {
  isLoading: boolean;
  images: Image[];
}

export function Editor({isLoading, images}: EditorProps) {
  if(isLoading) {
    // TODO: loading components
  }

  return (
    <div>
      <ImageLibrary images={images} onSelectedChange={(ids) => console.log(ids)} />
    </div>
  );
}
