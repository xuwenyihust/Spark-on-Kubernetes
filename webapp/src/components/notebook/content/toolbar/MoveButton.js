import { VscFolder } from "react-icons/vsc";
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import MoveDialog from "../../header/move/MoveDialog";
import { useState } from 'react';

const MoveButton = ({ 
  notebook,
  headerIconSize
 }) => {

  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  return (
    <div>
      <Tooltip title="Move Notebook">
        <IconButton 
          disableRipple 
          onClick={() => { setMoveDialogOpen(true) }}
          aria-label="move" 
            sx={{ 
                width: 'auto', 
                mt: 0.5 }}>
            <VscFolder 
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

      <MoveDialog 
        notebook={notebook}
        moveDialogOpen={moveDialogOpen}
        setMoveDialogOpen={setMoveDialogOpen}/>
    </div>
  );
};

export default MoveButton;