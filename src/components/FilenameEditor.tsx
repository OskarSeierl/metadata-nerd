import {Image} from "../../shared/types/image.ts";
import {TypographyLarge} from "@/components/ui/typography/typographyLarge.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {patternPlaceholders} from "../../shared/constants/file-name-placeholders.ts";
import {FilenamePatternPlaceholders} from "../../shared/types/file-name.ts";

interface FilenameEditorProps {
  images: Image[];
}

const formSchema = z.object({
  pattern: z
    .string()
    .max(250, "File name must be at most 250 characters."),
});

export function FilenameEditor({}: FilenameEditorProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pattern: "<YYYY>-<MM>-<DD>_image",
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // TODO
    console.log(data);
  }

  const insertPlaceholder = (placeholder: keyof FilenamePatternPlaceholders) => {
    const current = form.getValues("pattern")
    form.setValue("pattern", current + "<" + placeholder + ">", { shouldValidate: true })
  }

  return (
    <div className="space-y-3 px-3 pt-3">
      <TypographyLarge>Filename</TypographyLarge>
      <form id="filename-editor-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="pattern"
            control={form.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="filename-editor-form-pattern">
                  Pattern
                </FieldLabel>
                <Input
                  {...field}
                  id="filename-editor-form-pattern"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                <FieldDescription>
                  Use the placeholder listed below.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}/>
                )}
              </Field>
            )}
          />
          <ButtonGroup className="flex flex-wrap gap-x-1 gap-y-2">
            {
              Object.keys(patternPlaceholders).map((placeholder, i) => {
                return (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        key={i}
                        variant="outline"
                        onClick={() => insertPlaceholder(placeholder)}
                      >
                        {"<"}{placeholder}{">"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {patternPlaceholders[placeholder].description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )
              })
            }
          </ButtonGroup>
        </FieldGroup>
      </form>
    </div>
  )
}
