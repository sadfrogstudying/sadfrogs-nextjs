import styled from "@emotion/styled";
import CreateStudySpotFormSheet from "~/components/StudySpot/CreateStudySpotFormSheet";

const Header = () => {
  return (
    <>
      <StyledHeader>
        <HeaderTitle>Sad Frogs Studying</HeaderTitle>
      </StyledHeader>
      <CreateNewStudySpotWrapper>
        <CreateStudySpotFormSheet />
      </CreateNewStudySpotWrapper>
    </>
  );
};

export default Header;

const StyledHeader = styled.header`
  display: flex;
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  padding: 1rem;
`;
const HeaderTitle = styled.h1`
  color: #333;
  font-family: "Times New Roman", Times, serif;
  font-weight: 400;
  font-size: 2.5rem;
  letter-spacing: -0.05rem;
`;
const CreateNewStudySpotWrapper = styled.div`
  display: flex;
  position: fixed;
  z-index: 3;
  top: 0;
  right: 0;
  padding: 1rem;
`;
