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
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  const selectedImagesArray = useMemo(() => {
    if (selectedImages.size === 0) return [];
    return images.filter(img => selectedImages.has(img.id));
  }, [images, selectedImages]);

  const allImageIds = useMemo(() => new Set(images.map((image) => image.id)), [images]);

  const handleToggleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedImages(allImageIds);
    } else {
      setSelectedImages(new Set());
    }
  }, [allImageIds]);

  const handleToggleImage = useCallback((image: Image) => {
    setSelectedImages((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id);
      } else {
        newSelected.add(image.id);
      }
      return newSelected;
    });
  }, []);

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
            <MetadataEditor images={selectedImagesArray} onFinish={onImagesChange} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="30%">
            <FilenameEditor images={selectedImagesArray} onFinish={onImagesChange} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}


