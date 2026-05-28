import {FolderPicker, FolderPickerProps} from "@/components/FolderPicker.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DatabaseSync01Icon, FolderDetailsIcon, SearchVisualIcon} from "@hugeicons/core-free-icons";
import {HugeiconsIcon} from "@hugeicons/react";
import {TypographyH1} from "@/components/ui/typographyH1.tsx";
import {Button} from "@/components/ui/button.tsx";

import {Spinner} from "@/components/ui/spinner.tsx";

interface GettingStartedProps {
  folderPickerProps: FolderPickerProps;
  onStartClick: () => void;
  isLoading?: boolean;
}

export function GettingStarted({folderPickerProps, onStartClick, isLoading}: GettingStartedProps) {
  const featureCards = [
    {
      title: "Folder Insights",
      description: "Read and summarize metadata from your selected directory.",
      icon: FolderDetailsIcon,
    },
    {
      title: "Smart Detection",
      description: "Automatically identify useful metadata fields and patterns.",
      icon: SearchVisualIcon,
    },
    {
      title: "Structured Output",
      description: "Prepare clean metadata for indexing and analysis workflows.",
      icon: DatabaseSync01Icon,
    },
  ];

  return (
    <section className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center gap-8 py-6">
      <div className="space-y-2 text-center">
        <TypographyH1>Welcome to Metadata, Nerd!</TypographyH1>
        <p className="text-muted-foreground">Analyze folder metadata faster with guided tools.</p>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-3">
        {featureCards.map((feature) => (
          <Card key={feature.title} className="h-full">
            <CardHeader>
              <HugeiconsIcon icon={feature.icon} className="size-5 text-primary"/>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full max-w-3xl space-y-4 text-center">
        <h2 className="text-xl font-semibold">Let's get started</h2>
        <FolderPicker
          {...folderPickerProps}
        />
      </div>
      {folderPickerProps.selectedFolder && (
        <>
          <p className="text-center text-sm text-muted-foreground">
            Ready to work on <span className="font-mono text-foreground">{folderPickerProps.selectedFolder}</span>
          </p>
          <Button onClick={onStartClick} size="lg" disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Spinner className="size-4" />
                Analyzing...
              </>
            ) : (
              'Start Analysis'
            )}
          </Button>
        </>
      )}
    </section>
  );
}
