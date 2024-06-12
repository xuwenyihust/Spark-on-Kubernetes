import { useState } from 'react';
import { Button, Typography, Box, Dialog, DialogActions, TextField, DialogContent, DialogTitle } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CgChevronDown } from "react-icons/cg";
import { createNotebook } from '../../../api';
import config from '../../../config';


const WorkspaceSidebarHeader = ({
  currentPath,
  setCurrentPath,
  refreshKey,
  setRefreshKey,
  createDirectory
}) => {
  const baseUrl = `${config.jupyterBaseUrl}/api/contents/`

  const [anchorEl, setAnchorEl] = useState(null);
  const [createNotebookDialogOpen, setCreateNotebookDialogOpen] = useState(false);
  const [notebookName, setNotebookName] = useState('');

  const handleCreateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateClose = () => {
    setAnchorEl(null);
  };

  const handleCreateNotebook = () => {
    console.log('Creating notebook:', notebookName);
    console.log('Current path:', `${baseUrl}${currentPath}`);
    createNotebook(`${baseUrl}${currentPath}`, notebookName);
    setCreateNotebookDialogOpen(false);
    handleCreateClose();
    setRefreshKey(oldKey => oldKey + 1);
  }

  return (
    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Roboto',
            fontSize: '15px',
            color: 'lightgrey',
            fontWeight: 'bold',
            marginLeft: '20px',
            marginTop: '20px',
            marginBottom: '20px'
          }}>
          Workspace
        </Typography>
        <Button
          endIcon={<CgChevronDown />}
          onClick={handleCreateClick}
          style={{ 
            fontFamily: 'Roboto',
            color: 'lightgrey', 
            marginRight: '20px',
            marginTop: '18px',
            border: '1px solid grey',
            width: '100px',
            height: '30px'
            }}>Create
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCreateClose}
          PaperProps={{
            elevation: 0,
            style: { 
              width: '100px',
              backgroundColor: '#222',
              borderBottom: '1px solid grey',
              borderLeft: '1px solid grey',
              borderRight: '1px solid grey',
            },
          }}
        >
          {/* Create Folder */}
          <MenuItem 
            onClick={() => {
              handleCreateClose();
              createDirectory(currentPath);
              // refresh the workspace to reflect the new directory
              setRefreshKey(oldKey => oldKey + 1);
            }}
            style={{ color: 'lightgrey' }}>Folder</MenuItem>

          {/* Create Notebook */}
          <MenuItem 
            onClick={() => {
              setCreateNotebookDialogOpen(true);
              setRefreshKey(oldKey => oldKey + 1);
            }}
            style={{ color: 'lightgrey' }}>Notebook</MenuItem>

          <Dialog 
            open={createNotebookDialogOpen} 
            sx={{
              '.MuiPaper-root': { 
                backgroundColor: '#222',
                color: 'lightgrey',
                width: '300px'
              }
            }}
            >
            <DialogTitle>Create Notebook</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Notebook Name"
                type="text"
                fullWidth
                value={notebookName}
                sx={{ 
                  '.MuiInputBase-root': { color: 'lightgrey' },
                  '.MuiFormLabel-root': { color: 'grey' },
                  '.MuiInputLabel-root': { color: 'grey' },
                  '.MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#eee' },
                    '&:hover fieldset': { borderColor: '#ddd' },
                    '&.Mui-focused fieldset': { borderColor: '#ddd' },
                  },
                }}
                onChange={(e) => setNotebookName(e.target.value)}
              />
            </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateNotebookDialogOpen(false);
            handleCreateClose();}}>Cancel</Button>
          <Button onClick={() => {
            handleCreateNotebook();
            }}>Create</Button>
        </DialogActions>
      </Dialog>

        </Menu>
      </Box>
  );
}

export default WorkspaceSidebarHeader;