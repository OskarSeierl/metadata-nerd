import {Image} from "../../shared/types/image.ts";
import {ImageLibrary} from "@/components/library/ImageLibrary.tsx";
import {useState} from "react";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";

interface EditorProps {
  images: Image[];
  onCloseFolder: () => void;
}

export function Editor({images, onCloseFolder}: EditorProps) {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);

  return (
    <ResizablePanelGroup>
      <ResizablePanel defaultSize="75%" minSize="600px">
        <ImageLibrary images={images} onSelectedChange={setSelectedImages} onCloseFolder={onCloseFolder} />
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize="25%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
