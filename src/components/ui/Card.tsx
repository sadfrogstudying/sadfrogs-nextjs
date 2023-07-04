import styled from "@emotion/styled";
import { formTokens } from "~/tokens";

export const CardHeader = styled.div`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
export const CardContent = styled.div`
  padding: 0 1.75rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;
export const CardFooter = styled.div`
  padding: 0 1.75rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;
export const Card = styled.div`
  margin: auto;
  height: fit-content;
  background-color: #fff;
  border: 1px solid ${formTokens.borderColor};
  border-radius: ${formTokens.borderRadius}rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 40rem;
`;
export const CardTitle = styled.h3`
  font-size: 1.3rem;
`;
export const CardDescription = styled.p``;
