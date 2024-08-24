import { Card } from '@mui/material';
import MoveButton from "./MoveButton";
import SaveButton from "./SaveButton";
import RunAllButton from "./RunAllButton";
import DeleteButton from "./DeleteButton";
import CreateSparkButton from './CreateSparkButton';

const NotebookToolbar = ({ 
  notebook,
  runAllCells, 
  saveNotebook, 
  deleteNotebook
}) => {
  const headerIconSize = 13;

  const createSparkSession = () => {
    console.log('Creating Spark Session...');
  }

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

        <CreateSparkButton
          createSparkSession={createSparkSession}
          headerIconSize={headerIconSize}/>

        <SaveButton 
          headerIconSize={headerIconSize}
          saveNotebook={saveNotebook}/>

        <RunAllButton
          runAllCells={runAllCells}
          headerIconSize={headerIconSize}/>

        <MoveButton 
          notebook={notebook}
          headerIconSize={headerIconSize}/>

        <DeleteButton
          deleteNotebook={deleteNotebook}
          headerIconSize={headerIconSize}/>

    </Card>
  )
}

export default NotebookToolbar;