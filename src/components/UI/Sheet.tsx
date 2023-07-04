import styled from "@emotion/styled";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { formTokens } from "~/tokens";

const SheetRoot = styled(SheetPrimitive.Root)``;
const SheetTrigger = styled(SheetPrimitive.Trigger)`
  all: unset;
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
  /* animation: contentShow 500ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes contentShow {
    from {
      opacity: 0;
      right: -100%;
    }
    to {
      opacity: 1;
      right: 0;
    }
  } */
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

export {
  SheetRoot,
  SheetContent,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
