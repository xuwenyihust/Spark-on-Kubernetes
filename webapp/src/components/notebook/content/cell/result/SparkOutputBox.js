import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '85%',
  marginTop: 0,
  marginBottom: 1,
  marginLeft: 40,
  marginRight: 1,
  '& .MuiCard-root': {
    marginLeft: 40,
    width: '85%'
  }
}));

function SparkOutputBox({ children }) {
  return <StyledBox>{children}</StyledBox>;
}

export default SparkOutputBox;