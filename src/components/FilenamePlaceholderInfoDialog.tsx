import {HugeiconsIcon} from '@hugeicons/react';
import {Button} from './ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle, DialogClose, DialogFooter
} from "@/components/ui/dialog.tsx";
import {ExternalLinkButton} from "@/components/ExternalLinkButton.tsx";
import {InformationCircleIcon} from "@hugeicons/core-free-icons";

export function FilenamePlaceholderInfoDialog() {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          <HugeiconsIcon icon={InformationCircleIcon}/> Others
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Other Filename Placeholders</DialogTitle>
          <DialogDescription>
            You can use every available information of images in the filename.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>
            An available list of all EXIF metadata fields and their values can be found in the{" "}
            <ExternalLinkButton url={"https://exiftool.org/TagNames/EXIF.html"}>
              ExifTool documentation
            </ExternalLinkButton>
            .
          </p>
          <p>
            To use them as placeholders, simply wrap the field name in angle brackets. For example, to include
            the camera model in the filename, you can use{" "}
            <span className="font-mono text-foreground">{"<"}Model{">"}</span>.
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
