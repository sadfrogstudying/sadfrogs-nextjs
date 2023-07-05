import styled from "@emotion/styled";
import { formTokens } from "~/tokens";
import { inputHoverFocusStyles } from "~/components/UI/Form";

const Button = styled.button`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  border-radius: ${formTokens.borderRadius}rem;
  background-color: ${formTokens.inputBg};
  height: ${formTokens.height}rem;
  padding: 0 ${formTokens.inputSpacing}px;
  ${inputHoverFocusStyles}
`;

export default Button;
