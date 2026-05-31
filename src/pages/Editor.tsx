import {Image} from "../../shared/types/image.ts";
import {ImageLibrary} from "@/components/ImageLibrary.tsx";

interface EditorProps {
  images: Image[];
}

export function Editor({images}: EditorProps) {
  return (
    <div>
      <ImageLibrary images={images} onSelectedChange={(ids) => console.log(ids)} />
    </div>
  );
}
