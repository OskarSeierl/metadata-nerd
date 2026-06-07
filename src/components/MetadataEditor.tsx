import {Image} from "../../shared/types/image.ts";
import {TypographyLarge} from "@/components/ui/typography/typographyLarge.tsx";

interface MetadataEditorProps {
  images: Image[];
}

export function MetadataEditor({images}: MetadataEditorProps) {
  return (
    <div className="space-y-3 px-3">
      <TypographyLarge>Metadata</TypographyLarge>
      TODO
    </div>
  )
}
