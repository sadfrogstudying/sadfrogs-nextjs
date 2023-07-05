import styled from "@emotion/styled";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { formTokens } from "~/tokens";

const SheetRoot = styled(SheetPrimitive.Root)``;
const SheetTrigger = styled(SheetPrimitive.Trigger)`
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: ${formTokens.borderRadius}rem;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: pink;
  }
  &:focus {
    border: 2px solid violet;
  }

  height: ${formTokens.height}rem;
  width: 8rem;
  font-family: "Times New Roman", Times, serif;
  font-weight: 400;
  letter-spacing: -0.01rem;
`;
const SheetPortal = styled(SheetPrimitive.Portal)``;
const SheetOverlay = styled(SheetPrimitive.Overlay)`
  position: fixed;
  inset: 0;

  background: #fffbd5; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #b20a2c, #fffbd5);
  background: linear-gradient(to right, #b20a2c, #fffbd5);

  opacity: 0.8;
`;
const SheetContent = styled(SheetPrimitive.Content)`
  background-color: white;
  border-radius: ${formTokens.borderRadius}rem 0 0 ${formTokens.borderRadius}rem;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
`;
const SheetHeader = styled.div`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
const SheetTitle = styled(SheetPrimitive.Title)`
  font-size: 1.3rem;
`;
const SheetDescription = styled(SheetPrimitive.Description)``;
const SheetClose = styled(SheetPrimitive.Close)`
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: ${formTokens.borderRadius}rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: pink;
  }
  &:focus {
    border: 2px solid violet;
  }

  height: ${formTokens.height}rem;
  width: ${formTokens.height}rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  position: absolute;
`;

export {
  SheetRoot,
  SheetContent,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
};
