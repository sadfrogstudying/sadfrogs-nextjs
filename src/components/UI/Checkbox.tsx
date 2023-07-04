import styled from "@emotion/styled";
import { Controller } from "react-hook-form";

import { CheckIcon } from "@radix-ui/react-icons";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { formTokens } from "~/tokens";
import { inputHoverFocusStyles } from "~/components/UI/Form";

const Checkbox = ({ name, ...props }: { name: string; [x: string]: any }) => (
  <Controller
    name={name}
    {...props}
    render={({ field }) => (
      <CheckboxRoot
        {...field}
        id={name}
        value={undefined}
        checked={field.value}
        onCheckedChange={field.onChange}
      >
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxRoot>
    )}
  />
);

export default Checkbox;

const CheckboxRoot = styled(CheckboxPrimitive.Root)`
  background-color: white;
  width: ${formTokens.height}rem;
  height: ${formTokens.height}rem;
  border-radius: ${formTokens.borderRadius}rem;
  display: flex;
  align-items: center;
  justify-content: center;
  ${inputHoverFocusStyles};
`;

const CheckboxIndicator = styled(CheckboxPrimitive.Indicator)`
  color: #000;
`;
