import { SiApachespark } from "react-icons/si";
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';


const CreateSparkButton = ({ createSparkSession, headerIconSize }) => {

  return (
    <Tooltip title="Create Spark Session">
      <IconButton 
        disableRipple
        onClick={createSparkSession} aria-label="create" 
          sx={{ 
              width: 'auto',
              mt: 0.5 }}>
          <SiApachespark 
            size={headerIconSize} 
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'black';
            }}
            style={{ 
              stroke: "white", 
              strokeWidth: "0.8px",
              color: 'black' 
            }}/>
      </IconButton>
    </Tooltip>
  );

}

export default CreateSparkButton;