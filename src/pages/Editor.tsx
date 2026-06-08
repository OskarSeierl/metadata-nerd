import {Image} from "../../shared/types/image.ts";
import {ImageLibrary} from "@/components/library/ImageLibrary.tsx";
import {useCallback, useMemo, useState} from "react";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {MetadataEditor} from "@/components/editor/metadata/MetadataEditor.tsx";
import {FilenameEditor} from "@/components/editor/filename/FilenameEditor.tsx";

interface EditorProps {
  images: Image[];
  onImagesChange: (changedImages: Image[]) => void;
  onCloseFolder: () => void;
}

export function Editor({images, onImagesChange, onCloseFolder}: EditorProps) {
  const [selectedImages, setSelectedImages] = useState<Set<Image>>(new Set());

  const selectedImagesArray = useMemo(() => Array.from(selectedImages), [selectedImages]);

  const handleToggleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedImages(new Set(images));
    } else {
      setSelectedImages(new Set());
    }
  }, [images]);

  const handleToggleImage = useCallback((image: Image) => {
    setSelectedImages((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(image)) {
        newSelected.delete(image);
      } else {
        newSelected.add(image);
      }
      return newSelected;
    });
  }, []);

  const handleImagesChange = useCallback((updatedImages: Image[]) => {
    onImagesChange(updatedImages);
    setSelectedImages(new Set());
  }, [onImagesChange]);

  return (
    <ResizablePanelGroup>
      <ResizablePanel defaultSize="75%" minSize="600px">
        <ImageLibrary
          images={images}
          selectedImages={selectedImages}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleImage={handleToggleImage}
          onCloseFolder={onCloseFolder}
        />
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize="25%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="70%">
            <MetadataEditor images={selectedImagesArray} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="30%">
            <FilenameEditor images={selectedImagesArray} onFinish={handleImagesChange} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}


