import { VscSave, VscRunAll, VscTrash, VscFlame } from "react-icons/vsc";
import Tooltip from '@mui/material/Tooltip';
import { Card, IconButton } from '@mui/material';
import MoveButton from "../header/move/MoveButton";

const NotebookToolbar = ({ 
  notebook,
  runAllCells, 
  saveNotebook, 
  deleteNotebook,
  createSparkSession
}) => {
  const headerIconSize = 13;

  return (
    <Card 
        sx={{
          position: 'fixed',
        }}
        style={{
          width: '30px',
          minHeight: '1000px',
          marginLeft: '-20px',
          marginRight: '0px',
          marginBottom: '-50px',
          paddingTop: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}>

        {/* Save Button */}
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

        {/* Run All Button */}
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

        <MoveButton 
          notebook={notebook}
          headerIconSize={headerIconSize}/>

        {/* New Spark Button */}
        <Tooltip title="Create Spark Session">
          <IconButton 
            disableRipple
            onClick={createSparkSession}
            aria-label="spark" 
            sx={{ 
                width: 'auto',
                mt: 0.5 }}>
            <VscFlame
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

        {/* Delete Button */}
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
    {/* </Box> */}
    </Card>
  )
}

export default NotebookToolbar;