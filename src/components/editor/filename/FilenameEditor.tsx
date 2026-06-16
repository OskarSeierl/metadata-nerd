import { Image } from "../../../../shared/types/image.ts";
import { TypographyLarge } from "@/components/ui/typography/typographyLarge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field.tsx";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { patternPlaceholders } from "../../../../shared/constants/file-name-placeholders.ts";
import { FilenamePatternPlaceholders } from "../../../../shared/types/file-name.ts";
import { FilenamePlaceholderInfoDialog } from "@/components/editor/filename/FilenamePlaceholderInfoDialog.tsx";
import { replacePlaceholdersInPattern } from "../../../../shared/utils/file.ts";
import { exampleImageData } from "../../../../shared/constants/example-image-data.ts";
import { useMemo, useState } from "react";
import { ProtectedRenameConfirm } from "@/components/editor/filename/ProtectedRenameConfirm.tsx";
import { parseResponse } from "@/lib/response-parser.ts";

interface FilenameEditorProps {
  images: Image[];
  onFinish: (changedImages: Image[]) => void;
}

export const editFilenameFormSchema = z.object({
  pattern: z
    .string()
    .trim()
    .min(1, "Pattern cannot be empty.")
    .max(150, "File name including placeholder must be maximum 150 characters.")
    .regex(
      /^[^\\/:*?"|]+$/,
      'Filename pattern cannot contain the following characters: \\ / : * ? " |'
    ),
});

export function FilenameEditor({ images, onFinish }: FilenameEditorProps) {
  const form = useForm<z.infer<typeof editFilenameFormSchema>>({
    resolver: zodResolver(editFilenameFormSchema),
    defaultValues: {
      pattern: "<YYYY>-<MM>-<DD>_image",
    },
  });

  const currentPattern = form.watch("pattern");
  const exampleOutput = useMemo(() => {
    return replacePlaceholdersInPattern(currentPattern, 0, exampleImageData);
  }, [currentPattern]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [validatedData, setValidatedData] = useState<z.infer<typeof editFilenameFormSchema> | null>(null);

  const insertPlaceholder = (placeholder: keyof FilenamePatternPlaceholders) => {
    const current = form.getValues("pattern");
    form.setValue("pattern", current + "<" + placeholder + ">", { shouldValidate: true });
  };

  const onFormSubmit = (data: z.infer<typeof editFilenameFormSchema>) => {
    setValidatedData(data);
    setIsConfirmOpen(true);
  };

  const executeRename = async () => {
    if (!validatedData) return;

    const changedImages = await parseResponse(
      window.electron.editor.renameImages(validatedData.pattern, images)
    );

    if (changedImages) {
      onFinish(changedImages);
    }
  };

  return (
    <div className="space-y-3 px-3 pt-3">
      <TypographyLarge>Filename</TypographyLarge>

      <form id="filename-editor-form" onSubmit={form.handleSubmit(onFormSubmit)}>
        <FieldGroup>
          <Controller
            name="pattern"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="filename-editor-form-pattern">Pattern</FieldLabel>
                <Input
                  {...field}
                  id="filename-editor-form-pattern"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                <FieldDescription>Use the placeholders listed below.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {Object.keys(patternPlaceholders).map((placeholder) => {
              return (
                <Tooltip key={placeholder}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => insertPlaceholder(placeholder as keyof FilenamePatternPlaceholders)}
                    >
                      {"<"}{placeholder}{">"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{patternPlaceholders[placeholder as keyof FilenamePatternPlaceholders].description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <FilenamePlaceholderInfoDialog />
          </div>

          <Field>
            <FieldLabel>Example</FieldLabel>
            <FieldDescription>
              {exampleImageData.filename} {"->"} {exampleOutput}.jpg
            </FieldDescription>
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={images.length === 0}>
              Rename {images.length} {images.length === 1 ? "file" : "files"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <ProtectedRenameConfirm
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        selectedImages={images}
        pattern={validatedData?.pattern || currentPattern}
        onConfirm={executeRename}
      />
    </div>
  );
}
