import {Image} from "../../shared/types/image.ts";
import {TypographyLarge} from "@/components/ui/typography/typographyLarge.tsx";

interface FilenameEditorProps {
  images: Image[];
}

export function FilenameEditor({}: FilenameEditorProps) {
  return (
    <div className="space-y-3 px-3 pt-3">
      <TypographyLarge>Filename</TypographyLarge>
      TODO
    </div>
  )
}
