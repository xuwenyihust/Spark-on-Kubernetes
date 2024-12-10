import Cell from './cell/Cell';
import NotebookModel from '../../../models/NotebookModel';
import NotebookToolbar from './NotebookToolbar';
import config from '../../../config';
import { Box, Button, Tooltip, Card } from '@mui/material';

const Code = ({ 
  notebook,
  notebookState,
  cellStatuses,
  setCellStatus,
  cellExecutedStatuses,
  setCellExecutedStatus,
  handleChangeCell,
  handleDeleteCell,
  handleChangeCellType,
  handleMoveCell,
  handleRunCodeCell,
  handleCopyCell,
  handleCreateCell,
  kernelId,
  setKernelId,
  runAllCells,
  saveNotebook,
  deleteNotebook,
  createSparkSession
}) => {

  const jupyterBaseUrl= `${config.jupyterBaseUrl}`
  const baseUrl = `${jupyterBaseUrl}/api/contents/`
  
  return (
    <Box sx={{ display: 'flex' }}>

      <NotebookToolbar
        notebook={notebook}
        runAllCells={runAllCells}
        saveNotebook={saveNotebook}
        deleteNotebook={deleteNotebook}
        createSparkSession={createSparkSession}/>

      <Box sx={{ 
          width: '95%',
          display: 'flex', 
          flexDirection: 'column',
          marginTop: '50px',
           }}>
        {notebookState.content && 
          notebookState.content.cells && 
          notebookState.content.cells.map((cell, index) => (
          <Box style={{ position: 'relative' }}>
              <Cell
                cell={cell}
                index={index}
                key={index}
                notebookState={notebookState}
                cellStatus={cellStatuses[index]}
                setCellStatus={status => setCellStatus(index, status)}
                cellExecutedStatus={cellExecutedStatuses[index]}
                setCellExecutedStatus={executed => setCellExecutedStatus(index, executed)}
                handleChangeCell={handleChangeCell}
                handleDeleteCell={handleDeleteCell} 
                handleChangeCellType={handleChangeCellType}
                handleMoveCell={handleMoveCell}
                handleRunCodeCell={handleRunCodeCell}
                handleCopyCell={handleCopyCell}
                handelRunAllAboveCells={
                    (index) => NotebookModel.runAllAboveCells(
                      index,
                      jupyterBaseUrl, 
                      notebookState, 
                      kernelId, 
                      setKernelId, 
                      cellStatuses, 
                      setCellStatus,
                      cellExecutedStatuses,
                      setCellExecutedStatus)}/>
              <div 
                  style={{ 
                      display: 'flex',
                      justifyContent: 'center'}}>
                  <Tooltip title="Add Code Cell" 
                      sx={{fontSize: 11,
                      color: "grey"}}>
                      <Button onClick={() => handleCreateCell('code', index + 1)}>
                          + Code
                      </Button>
                  </Tooltip>
                  <Tooltip title="Add Code Cell"
                      sx={{fontSize: 11,
                      color: "grey"}}>
                      <Button onClick={() => handleCreateCell('markdown', index + 1)}>
                          + Markdown
                      </Button>
                  </Tooltip>
              </div>
          </Box>
    ))}</Box>
    </Box>
  );
}

export default Code;