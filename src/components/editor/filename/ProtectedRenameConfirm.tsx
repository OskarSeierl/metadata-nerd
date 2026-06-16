import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Image} from "../../../../shared/types/image.ts";
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field.tsx";
import {replacePlaceholdersInPattern} from "../../../../shared/utils/file.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState, MouseEvent} from "react";
import {parseResponse} from "@/lib/response-parser.ts";

interface ProtectedRenameConfirmProps {
  selectedImages: Image[];
  pattern: string;
  onFinish: (changedImages: Image[]) => void;
}

export function ProtectedRenameConfirm({selectedImages, pattern, onFinish}: ProtectedRenameConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // <-- 1. Add this

  const exampleCount = Math.min(5, selectedImages.length);

  const handleConfirmClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const changedImages = await parseResponse(window.electron.editor.renameImages(pattern, selectedImages));
    if (changedImages) {
      onFinish(changedImages);
    }
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" disabled={selectedImages.length === 0 || isLoading}>
          Rename {selectedImages.length} {selectedImages.length === 1 ? "file" : "files"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rename {selectedImages.length} images?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to permanently rename <strong>{selectedImages.length}</strong> images. This action directly
            modifies the files on your disk and cannot be undone.
          </AlertDialogDescription>

          <Field>
            <FieldLabel>Some example of the selected images</FieldLabel>
            <FieldDescription>
              <ul className="font-mono">
                {selectedImages.slice(0, exampleCount).map((image, index) => (
                  <li key={index}>
                    {image.filename} {"->"} {replacePlaceholdersInPattern(pattern, index, image)}
                  </li>
                ))}
                {
                  selectedImages.length > exampleCount && (
                    <li>
                      ... and {selectedImages.length - exampleCount} more
                    </li>
                  )
                }
              </ul>
            </FieldDescription>
          </Field>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleConfirmClick(e)}>
            {
              isLoading ? (
                <>
                  <Spinner data-icon="inline-start"/>
                  Renaming...
                </>
              ) : (
                "Continue"
              )
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
