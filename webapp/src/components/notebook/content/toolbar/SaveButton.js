import { VscSave } from "react-icons/vsc";
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';

const SaveButton = ({ headerIconSize, saveNotebook }) => {

  return (
    <Tooltip title="Save Changes">
      <IconButton 
        disableRipple
        onClick={saveNotebook} aria-label="save" 
          sx={{ 
              width: 'auto',
              mt: 0.5 }}>
          <VscSave 
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

};

export default SaveButton;