import { Minus, SquareIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from './ui/button';

export function TitleBar() {
  return (
    <div className="titlebar-drag flex h-10 w-full items-center justify-between bg-background border-b border-border px-3 select-none">
      <div className="text-xs font-medium tracking-wide text-muted-foreground">
        METADATA NERD
      </div>

      <div className="titlebar-no-drag flex items-center gap-0.5">
        <Button
          onClick={window.electron.window.minimize}
          variant="ghost"
          size="icon-sm"
          title="Minimieren"
        >
          <HugeiconsIcon icon={Minus} />
        </Button>

        <Button
          onClick={window.electron.window.maximize}
          variant="ghost"
          size="icon-sm"
          title="Maximieren"
        >
          <HugeiconsIcon icon={SquareIcon} />
        </Button>

        <Button
          onClick={window.electron.window.close}
          variant="destructive"
          size="icon-sm"
          title="Schließen"
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </Button>
      </div>
    </div>
  )
}
