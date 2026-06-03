import {
  Sheet, SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Delete01Icon} from "@hugeicons/core-free-icons";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner.tsx";
import {parseResponse} from "@/lib/response-parser.ts";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsSheet({open, onOpenChange}: SettingsSheetProps) {
  const [isClearingCache, setIsClearingCache] = useState(false);

  const handleClearCache = async () => {
    setIsClearingCache(true);
    await parseResponse(window.electron.settings.deleteCache());
    setIsClearingCache(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            You can do basic operations here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={Delete01Icon}/>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Delete Cache</ItemTitle>
              <ItemDescription>
                Clear the application's cache to free up disk space and resolve potential issues. This will not delete
                your images or metadata.
                Only cached data such as thumbnails and temporary files will be removed.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="destructive"
                onClick={handleClearCache}
                disabled={isClearingCache}
              >
                {isClearingCache && (
                  <Spinner data-icon="inline-start" />
                )}
                Clear
              </Button>
            </ItemActions>
          </Item>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

