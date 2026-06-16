import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Image } from "../../../../shared/types/image.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useState, MouseEvent } from "react";

interface ProtectedRenameConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImages: Image[];
  onConfirm: () => Promise<void>;
}

export function ProtectedMetadataEditConfirm({ open, onOpenChange, selectedImages, onConfirm }: ProtectedRenameConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit {selectedImages.length} images?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to permanently rename <strong>{selectedImages.length}</strong> images. This action directly
            modifies the files on your disk and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmClick}>
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Editing...
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
