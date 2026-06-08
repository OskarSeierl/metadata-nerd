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

interface ProtectedRenameConfirmProps {
  isLoading: boolean;
  selectedImages: Image[];
  pattern: string;
  onConfirm: () => void;
}

export function ProtectedRenameConfirm({isLoading, selectedImages, pattern, onConfirm}: ProtectedRenameConfirmProps) {
  const exampleCount = Math.min(5, selectedImages.length);

  return (
    <AlertDialog>
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm()}>
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
