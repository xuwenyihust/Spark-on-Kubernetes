import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)({
  width: '85%',
  marginTop: 0,
  marginBottom: 1,
  marginLeft: 40,
  marginRight: 1,
  '& .jp-OutputArea-output': {
    padding: '10px 0',
  }
});

function SparkOutputBox({ children }) {
  return (
    <StyledBox>
      {children}
    </StyledBox>
  );
}

export default SparkOutputBox;