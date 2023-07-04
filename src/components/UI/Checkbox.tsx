import React from "react";

import styled from "@emotion/styled";

import { CheckedState } from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { formTokens } from "~/tokens";
import { inputHoverFocusStyles } from "~/components/UI/Form";

interface CheckboxProps {
  setValue: (checked: CheckedState) => void;
  [key: string]: any;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ setValue, ...props }, ref) => {
    return (
      <CheckboxRoot {...props} ref={ref} onCheckedChange={setValue}>
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxRoot>
    );
  }
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
