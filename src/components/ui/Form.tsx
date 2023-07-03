import styled from "@emotion/styled";
import { css } from "@emotion/react";

import * as Form from "@radix-ui/react-form";
import * as Checkbox from "@radix-ui/react-checkbox";

import { formTokens } from "~/tokens";

const inputHoverFocusStyles = css`
  border: 1px solid ${formTokens.borderColor};

  &:hover {
    border: 1px solid cyan;
  }
  &:focus {
    border: 1px solid blue;
  }
`;
export const FormRoot = styled(Form.Root)`
  margin: auto;
  width: 100%;
`;
export const FormField = styled(Form.Field)`
  display: grid;
  flex-grow: 1;
`;
export const FormLabel = styled(Form.Label)`
  font-weight: 500;
  line-height: ${formTokens.lineHeight}rem;
  margin-bottom: ${formTokens.labelSpacing}rem;
`;
export const FormMessage = styled(Form.Message)`
  color: red;
  opacity: 0.8;
  font-size: 0.8rem;
  line-height: ${formTokens.lineHeight}rem;
  margin-bottom: ${formTokens.labelSpacing}rem;
`;
export const Flex = styled("div")`
  display: flex;
  gap: 1rem;
  align-items: start;
  justify-content: space-between;
`;
const inputStyles = css`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${formTokens.borderRadius}rem;
  background-color: ${formTokens.inputBg};
  ${inputHoverFocusStyles}

  &::selection {
    background-color: chartreuse;
  }
`;
export const Input = styled.input`
  ${inputStyles};
  height: ${formTokens.height}rem;
  line-height: 1;
  padding: 0 ${formTokens.inputSpacing}px;

  &[data-invalid] {
    border: 1px solid red;
  }
  &[data-valid] {
    border: 1px solid #8acb49;
  }
`;
export const Button = styled.button`
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${formTokens.borderRadius}rem;
  padding: 1rem 0.5rem;
  line-height: 1;
  font-weight: 500;
  height: ${formTokens.height}rem;
  width: 100%;
  background-color: #333;
  color: #fff;
  ${inputHoverFocusStyles}
`;

export const CheckboxRoot = styled(Checkbox.Root)`
  background-color: white;
  width: ${formTokens.height}rem;
  height: ${formTokens.height}rem;
  border-radius: ${formTokens.borderRadius}rem;
  display: flex;
  align-items: center;
  justify-content: center;
  ${inputHoverFocusStyles};
`;

export const CheckboxIndicator = styled(Checkbox.Indicator)`
  color: #000;
`;

export const DropzoneRoot = styled.div`
  width: 100%;
  padding: ${formTokens.inputSpacing}px;
  border-radius: ${formTokens.borderRadius}rem;
  height: 200px;
  background-color: ${formTokens.inputBg};
  display: grid;
  margin-bottom: 10px;
  flex-grow: 1;

  ${inputHoverFocusStyles}
`;
export const DropzoneFilesPreview = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
`;
export const FormError = styled.div``;
