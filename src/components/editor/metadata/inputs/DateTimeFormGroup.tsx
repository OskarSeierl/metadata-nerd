import {Controller, Control, FieldValues, Path} from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";

interface DateTimeFormGroupProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  dateName: Path<TFieldValues>;
  timeName: Path<TFieldValues>;
}

export function DateTimeFormGroup<TFieldValues extends FieldValues>({
                                                                      control,
                                                                      dateName,
                                                                      timeName
                                                                    }: DateTimeFormGroupProps<TFieldValues>) {
  return (
    <FieldGroup className="flex-row">
      {/* DATE FIELD */}
      <Controller
        name={dateName}
        control={control}
        render={({field, fieldState}) => {
          return (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldLabel htmlFor={`${dateName}-picker`}>Date</FieldLabel>
              <Input
                {...field}
                type="date"
                id={`${dateName}-mask`}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          );
        }}
      />

      {/* TIME FIELD */}
      <Controller
        name={timeName}
        control={control}
        render={({field, fieldState}) => (
          <Field className="w-32" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${timeName}-picker`}>Time</FieldLabel>
            <Input
              {...field}
              type="time"
              id={`${timeName}-picker`}
              step="1"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
