import { IMaskMixin } from "react-imask";
import {InputGroupInput} from "@/components/ui/input-group.tsx"; // Check your import path

interface MaskedProps extends React.ComponentPropsWithoutRef<typeof InputGroupInput> {
  inputRef: React.Ref<HTMLInputElement>;
}

// 2. Use the strongly-typed interface to safely pass strict linter environments
export const MaskedDateInput = IMaskMixin(({ inputRef, ...props }: MaskedProps) => (
  <InputGroupInput {...props} ref={inputRef} />
));
