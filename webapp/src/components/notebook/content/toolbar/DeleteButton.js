import { VscTrash } from "react-icons/vsc";
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';

const DeleteButton = ({ deleteNotebook, headerIconSize }) => {
  return (
    <Tooltip title="Delete Notebook">
      <IconButton 
        disableRipple 
        onClick={deleteNotebook} aria-label="delete" 
          sx={{ 
              width: 'auto', 
              mt: 0.5 }}>
          <VscTrash 
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

export default DeleteButton;