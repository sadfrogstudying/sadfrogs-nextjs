import styled from "@emotion/styled";
import { css } from "@emotion/react";

import * as Form from "@radix-ui/react-form";

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
const FormRoot = styled(Form.Root)`
  margin: auto;
  width: 100%;
`;
const FormField = styled(Form.Field)`
  display: grid;
  flex-grow: 1;
`;
const FormLabel = styled(Form.Label)`
  font-weight: 500;
  line-height: ${formTokens.lineHeight}rem;
  margin-bottom: ${formTokens.labelSpacing}rem;
`;
const FormMessage = styled(Form.Message)`
  color: red;
  opacity: 0.8;
  font-size: 0.8rem;
  line-height: ${formTokens.lineHeight}rem;
  margin-bottom: ${formTokens.labelSpacing}rem;
`;
const Flex = styled("div")`
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
const Input = styled.input`
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
const Button = styled.button`
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

const DropzoneRoot = styled.div`
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
const DropzoneFilesPreview = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
`;
const FormError = styled.div``;

export {
  inputHoverFocusStyles,
  FormRoot,
  FormField,
  FormLabel,
  FormMessage,
  Flex,
  inputStyles,
  Input,
  Button,
  DropzoneRoot,
  DropzoneFilesPreview,
  FormError,
};
