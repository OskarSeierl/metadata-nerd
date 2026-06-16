import {Controller, Control, FieldValues, Path} from "react-hook-form";
import {Field, FieldLabel, FieldError, FieldGroup, FieldDescription} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";

interface DynamicExifFieldsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  discoveredKeys: string[];
}

export function DynamicExifFields<TFieldValues extends FieldValues>({
                                                                      control,
                                                                      discoveredKeys,
                                                                    }: DynamicExifFieldsProps<TFieldValues>) {
  if(discoveredKeys.length === 0) {
    return (
      <FieldDescription className="">Selected images to soo corresponding exif tags.</FieldDescription>
    );
  }

  return (
    <FieldGroup>
      {discoveredKeys.map((exifKey) => {
        const formPath = `exif.${exifKey}` as Path<TFieldValues>;

        return (
          <Controller
            key={exifKey}
            name={formPath}
            control={control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`dynamic-exif-${exifKey}`}>
                  {exifKey}
                </FieldLabel>
                <Input
                  {...field}
                  id={`dynamic-exif-${exifKey}`}
                  placeholder={`Enter custom value for ${exifKey}`}
                  autoComplete="off"
                  value={(field.value as string) || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />
        );
      })}
    </FieldGroup>
  );
}
