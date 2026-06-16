import {Image} from "../../../../shared/types/image.ts";
import {TypographyLarge} from "@/components/ui/typography/typographyLarge.tsx";
import {Field, FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet} from "@/components/ui/field.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {useEffect, useMemo, useState} from "react";
import {ProtectedMetadataEditConfirm} from "@/components/editor/metadata/ProtectedMetadataEditConfirm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DateTimeFormGroup} from "@/components/editor/metadata/inputs/DateTimeFormGroup.tsx";
import {LocationFormGroup} from "@/components/editor/metadata/inputs/LocationFormGroup.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrowDown01Icon, ArrowUp01Icon} from "@hugeicons/core-free-icons";
import {DynamicExifFields} from "@/components/editor/metadata/inputs/DynamicExifFields.tsx";

interface MetadataEditorProps {
  images: Image[];
  onFinish: (changedImages: Image[]) => void;
}

const editMetadataFormSchema = z.object({
  dateText: z
    .string()
    .optional(),
  timeText: z
    .string()
    .optional(),
  location: z
    .string()
    .max(256, "Location address must be maximum 150 characters.")
    .optional(),
  latitude: z
    .string()
    .optional(),
  longitude: z
    .string()
    .optional(),
  exif: z
    .record(z.string(), z.string().optional())
});

type MetadataFormValues = z.infer<typeof editMetadataFormSchema>;
type ValidatedData = MetadataFormValues & { dateTimeISO?: string };

export function MetadataEditor({images, onFinish}: MetadataEditorProps) {
  const form = useForm<MetadataFormValues>({
    resolver: zodResolver(editMetadataFormSchema),
    defaultValues: {
      dateText: "",
      timeText: "",
      location: "",
      latitude: "",
      longitude: "",
      exif: {},
    },
  });

  const [isOtherFieldsOpen, setIsOtherFieldsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [validatedData, setValidatedData] = useState<ValidatedData | null>(null);

  const discoveredExifKeys = useMemo(() => {
    const uniqueKeys = new Set<string>();
    images.forEach((img) => {
      if (img.metadata) {
        Object.keys(img.metadata).forEach((key) => uniqueKeys.add(key));
      }
    });
    uniqueKeys.delete("dateTimeOriginal");
    uniqueKeys.delete("gpsLatitude");
    uniqueKeys.delete("gpsLongitude");
    return Array.from(uniqueKeys);
  }, [images]);

  useEffect(() => {
    if (images.length === 0) {
      form.reset({ location: "", dateText: "", timeText: "", exif: {} });
      return;
    }

    // 1. Grab the metadata of the very first image to use as a baseline comparison
    const firstImg = images[0];

    // 2. Helper function to check if EVERY selected image shares the exact same value
    const getCommonValue = (extractor: (img: Image) => string | undefined) => {
      const firstVal = extractor(firstImg);
      const allMatch = images.every((img) => extractor(img) === firstVal);
      return allMatch ? firstVal || "" : ""; // Return blank if mixed or undefined
    };

    // 3. Extract common dynamic EXIF keys
    const commonExif: Record<string, string> = {};
    if (firstImg.metadata) {
      Object.keys(firstImg.metadata).forEach((key) => {
        const firstVal = String(firstImg.metadata?.[key] || "");
        const allMatch = images.every((img) => String(img.metadata?.[key] || "") === firstVal);
        if (allMatch) {
          commonExif[key] = firstVal;
        }
      });
    }

    // 4. Reset the form with the newly calculated common baselines
    form.reset({
      location: getCommonValue((img) => img.metadata?.location as string),
      latitude: getCommonValue((img) => img.metadata?.gpsLatitude?.toString()),
      longitude: getCommonValue((img) => img.metadata?.gpsLongitude?.toString()),
      // If your backend splits dateTimeOriginal into separate fields or an ISO string:
      dateText: getCommonValue((img) => img.metadata?.dateTimeOriginal?.split("T")[0]),
      timeText: getCommonValue((img) => img.metadata?.dateTimeOriginal?.split("T")[1]?.slice(0, 8)),
      exif: commonExif,
    });

  }, [images, form]);

  const onFormSubmit = (data: MetadataFormValues) => {
    let finalIsoString = undefined;

    if (data.dateText) {
      const dateObj = new Date(data.dateText);
      if (!isNaN(dateObj.getTime())) {
        const [hours, minutes, seconds] = (data.timeText || "00:00:00").split(":");
        dateObj.setHours(Number(hours || 0), Number(minutes || 0), Number(seconds || 0));
        finalIsoString = dateObj.toISOString();
      }
    }

    setValidatedData({...data, dateTimeISO: finalIsoString});
    setIsConfirmOpen(true);
  };

  const executeEdit = async () => {
    console.log("Executing metadata edit with ISO Date:", validatedData?.dateTimeISO);
    // TODO: window.electron.editor.editMetadata(...)
    onFinish(images);
  };

  return (
    <div className="space-y-3 px-3 pt-3">
      <TypographyLarge>Metadata</TypographyLarge>

      <form id="metadata-editor-form" onSubmit={form.handleSubmit(onFormSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Datetime</FieldLegend>
            <DateTimeFormGroup
              control={form.control}
              dateName="dateText"
              timeName="timeText"
            />
          </FieldSet>
          <FieldSet>
            <FieldLegend>Location</FieldLegend>
            <LocationFormGroup
              control={form.control}
              setValue={form.setValue}
              name="location"
              latName="latitude"
              lonName="longitude"
            />
          </FieldSet>
          <FieldSeparator/>
          <FieldSet>
            <Collapsible open={isOtherFieldsOpen} onOpenChange={setIsOtherFieldsOpen}>
              <CollapsibleTrigger className="w-full">
                <FieldLegend className="flex align-center justify-between">
                  <div>Other Fields (Advanced)</div>
                  <HugeiconsIcon icon={isOtherFieldsOpen ? ArrowUp01Icon : ArrowDown01Icon}/>
                </FieldLegend>
                <FieldDescription>
                  {
                    isOtherFieldsOpen ? (
                      <>
                        All other metadata fields can be edited without without application safeguards. This means that
                        if you
                        enter invalid data, it may cause issues when viewing or editing the image in the future. Use
                        with
                        caution.
                      </>
                    ) : (
                      <em>
                        Press to show more...
                      </em>
                    )
                  }
                </FieldDescription>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2">
                  <DynamicExifFields control={form.control} discoveredKeys={discoveredExifKeys} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </FieldSet>


          <Field>
            <Button type="submit" className="w-full" disabled={images.length === 0}>
              Edit {images.length} {images.length === 1 ? "file" : "files"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <ProtectedMetadataEditConfirm
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        selectedImages={images}
        onConfirm={executeEdit}
      />
    </div>
  );
}
