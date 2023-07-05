import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import styled from "@emotion/styled";

const AlertDialog = styled(AlertDialogPrimitive.Root)``;
const AlertDialogTrigger = styled(AlertDialogPrimitive.Trigger)``;
const AlertDialogContent = styled(AlertDialogPrimitive.Content)`
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 25px;

  &:focus {
    outline: none;
  }
`;
const AlertDialogHeader = styled.div``;
const AlertDialogFooter = styled.div``;
const AlertDialogTitle = styled(AlertDialogPrimitive.Title)`
  margin: 0;
  color: var(--mauve-12);
  font-size: 17px;
  font-weight: 500;
`;
const AlertDialogDescription = styled(AlertDialogPrimitive.Description)`
  margin-bottom: 20px;
  color: var(--mauve-11);
  font-size: 15px;
  line-height: 1.5;
`;
const AlertDialogAction = styled(AlertDialogPrimitive.Action)``;
const AlertDialogCancel = styled(AlertDialogPrimitive.Cancel)``;
const AlertDialogPortal = styled(AlertDialogPrimitive.Portal)``;
const AlertDialogOverlay = styled(AlertDialogPrimitive.Overlay)`
  inset: 0;
  position: fixed;

  background: #fffbd5; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #b20a2c, #fffbd5);
  background: linear-gradient(to right, #b20a2c, #fffbd5);

  opacity: 0.8;
`;

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPortal,
  AlertDialogOverlay,
};
