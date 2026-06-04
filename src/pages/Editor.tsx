import {Image} from "../../shared/types/image.ts";
import {ImageLibrary} from "@/components/library/ImageLibrary.tsx";
import {useState} from "react";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {MetadataEditor} from "@/components/MetadataEditor.tsx";
import {FilenameEditor} from "@/components/FilenameEditor.tsx";

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
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="70%">
            <MetadataEditor images={selectedImages} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="30%">
            <FilenameEditor images={selectedImages} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
