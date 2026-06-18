import {useState, useEffect} from "react";
import {Control, Controller, FieldValues, Path, PathValue, UseFormSetValue} from "react-hook-form";
import {Field, FieldLabel, FieldError, FieldGroup} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Popover, PopoverContent, PopoverAnchor} from "@/components/ui/popover.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Location01Icon} from "@hugeicons/core-free-icons";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";

interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  name: Path<TFieldValues>;
  latName: Path<TFieldValues>;
  lonName: Path<TFieldValues>;
}

export function LocationFormGroup<TFieldValues extends FieldValues>({
                                                                      control,
                                                                      setValue,
                                                                      name,
                                                                      latName,
                                                                      lonName,
                                                                    }: LocationSelectProps<TFieldValues>) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchTerm
          )}&limit=5&addressdetails=1`,
          {
            headers: {"User-Agent": "MetadataNerd-Electron-App"},
          }
        );
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
          throw new Error();
        }

        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        toast.error("Error fetching location details", {position: "bottom-center"});
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <FieldGroup>
      <Controller
        name={name}
        control={control}
        render={({field, fieldState}) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="location-search">Address</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverAnchor asChild>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="location-search"
                    placeholder="e.g., Vienna, Austria"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      setSearchTerm(val);
                    }}
                    onFocus={() => {
                      if (suggestions.length > 0) setOpen(true);
                    }}
                  />
                  <InputGroupAddon align="inline-end">
                    {isLoading ? <Spinner/> : <HugeiconsIcon icon={Location01Icon}/>}
                  </InputGroupAddon>
                </InputGroup>
              </PopoverAnchor>

              <PopoverContent align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                <ul className="space-y-0.5">
                  {suggestions.map((place) => (
                    <li key={place.place_id}>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          field.onChange(place.display_name);
                          setValue(latName, place.lat as PathValue<TFieldValues, Path<TFieldValues>>, {shouldValidate: true});
                          setValue(lonName, place.lon as PathValue<TFieldValues, Path<TFieldValues>>, {shouldValidate: true});
                          setSearchTerm("");
                          setOpen(false);
                        }}
                        className="w-full truncate block"
                        title={place.display_name}
                      >
                        {place.display_name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </Field>
        )}
      />

      <FieldGroup className="flex-row">
        {/* LATITUDE */}
        <Controller
          name={latName}
          control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location-lat">Latitude</FieldLabel>
              <Input
                {...field}
                id="location-lat"
                placeholder="e.g., 48.2084"
                autoComplete="off"
                value={field.value || ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        {/* LONGITUDE */}
        <Controller
          name={lonName}
          control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location-lon">Longitude</FieldLabel>
              <Input
                {...field}
                id="location-lon"
                placeholder="e.g., 16.3738"
                autoComplete="off"
                value={field.value || ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />
      </FieldGroup>
    </FieldGroup>
  );
}
