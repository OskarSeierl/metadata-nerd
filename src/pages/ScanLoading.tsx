import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from '@hugeicons/react';
import { Image01Icon } from '@hugeicons/core-free-icons';
import { ProgressUpdate } from "../../shared/types/electron-api.ts";

interface ScanLoadingProps {
  progress: ProgressUpdate;
}

export function ScanLoading({ progress }: ScanLoadingProps) {
  const percentValue = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      <div className="w-full max-w-md p-8 flex flex-col gap-8 items-center animate-in fade-in zoom-in-95 duration-300">

        <div className="relative flex items-center justify-center w-20 h-20">
          <HugeiconsIcon icon={Image01Icon} className="w-8 h-8 text-primary absolute z-10" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Scanning Library
          </h2>
          <p className="text-sm text-muted-foreground">
            Extracting metadata and generating thumbnails...
          </p>
        </div>

        <div className="w-full space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">{percentValue}%</span>
            <span className="text-foreground">
              {progress.current.toLocaleString()} / {progress.total.toLocaleString()}
            </span>
          </div>
          <Progress value={percentValue} className="h-2 w-full" />
        </div>

      </div>
    </div>
  );
}
