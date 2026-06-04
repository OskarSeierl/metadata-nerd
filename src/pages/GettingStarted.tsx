import {FolderPicker, FolderPickerProps} from "@/components/FolderPicker.tsx";
import {DatabaseSync01Icon, File01Icon, Analytics01Icon} from "@hugeicons/core-free-icons";
import {HugeiconsIcon} from "@hugeicons/react";
import {TypographyH1} from "@/components/ui/typography/typographyH1.tsx";
import {Button} from "@/components/ui/button.tsx";

import {Spinner} from "@/components/ui/spinner.tsx";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item.tsx";

interface GettingStartedProps {
  folderPickerProps: FolderPickerProps;
  onStartClick: () => void;
  isLoading?: boolean;
}

export function GettingStarted({folderPickerProps, onStartClick, isLoading}: GettingStartedProps) {
  const featureCards = [
    {
      title: "Edit Metadata",
      description: "Update and standardize metadata including geolocation and datetime information for better organization.",
      icon: DatabaseSync01Icon,
    },
    {
      title: "Standardize File Names",
      description: "Edit and normalize file names consistently across your entire image library for universal naming standards.",
      icon: File01Icon,
    },
    {
      title: "Overview",
      description: "Get a comprehensive overview of your image library's metadata, including geolocation and datetime distributions, to identify patterns and outliers.",
      icon: Analytics01Icon,
    },
  ];

  return (
    <section className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center gap-8 py-6">
      <div className="space-y-2 text-center">
        <TypographyH1>Welcome to Metadata, Nerd!</TypographyH1>
        <p className="text-muted-foreground">Analyze and edit image metadata faster with guided tools.</p>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-3">
        {featureCards.map((feature) => (
          <Item variant="outline" key={feature.title}>
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={feature.icon}/>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{feature.title}</ItemTitle>
              <ItemDescription>
                {feature.description}
              </ItemDescription>
            </ItemContent>
          </Item>
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
