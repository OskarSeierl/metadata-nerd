import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group.tsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input.tsx";
import {MaskedDateInput} from "@/components/editor/metadata/inputs/MaskedDateInput.tsx";
import { formatDate } from "../../../../../shared/utils/time";

interface DateTimeFormGroupProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  dateName: Path<TFieldValues>;
  timeName: Path<TFieldValues>;
}

// 3. Apply the generic to the functional component definition
export function DateTimeFormGroup<TFieldValues extends FieldValues>({
                                                                      control,
                                                                      dateName,
                                                                      timeName
                                                                    }: DateTimeFormGroupProps<TFieldValues>) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(undefined);

  return (
    <FieldGroup className="flex-row">
      {/* DATE FIELD */}
      <Controller
        name={dateName}
        control={control}
        render={({ field, fieldState }) => {
          const parsedDate = field.value ? new Date(field.value) : undefined;
          const isDateValid = parsedDate && !isNaN(parsedDate.getTime());

          return (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldLabel htmlFor={`${dateName}-picker`}>Date</FieldLabel>
              <InputGroup>
                <MaskedDateInput
                  {...field}
                  id={`${dateName}-mask`}
                  mask="0000-00-00"
                  onAccept={(value: string) => field.onChange(value)}
                  placeholder="YYYY-MM-DD"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <InputGroupButton
                        id={`${dateName}-btn`}
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Select date"
                      >
                        <HugeiconsIcon icon={Calendar01Icon} />
                        <span className="sr-only">Select date</span>
                      </InputGroupButton>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={isDateValid ? parsedDate : undefined}
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            field.onChange(formatDate(selectedDate));
                            setMonth(selectedDate);
                          } else {
                            field.onChange("");
                          }
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      {/* TIME FIELD */}
      <Controller
        name={timeName}
        control={control}
        render={({ field, fieldState }) => (
          <Field className="w-32" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${timeName}-picker`}>Time</FieldLabel>
            <Input
              {...field}
              type="time"
              id={`${timeName}-picker`}
              step="1"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
