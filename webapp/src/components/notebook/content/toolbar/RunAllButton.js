import { VscRunAll } from "react-icons/vsc";
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';

const RunAllButton = ({ runAllCells, headerIconSize }) => {
  return (
    <Tooltip title="Run All Cells">
      <IconButton 
        disableRipple 
        onClick={() => 
          runAllCells()}
        aria-label="run" 
          sx={{ 
              width: 'auto', 
              mt: 0.5 }}>
          <VscRunAll 
            size={headerIconSize} 
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'black';
            }}
            style={{ color: 'black' }}/>
      </IconButton>
    </Tooltip>
  );
}

export default RunAllButton;