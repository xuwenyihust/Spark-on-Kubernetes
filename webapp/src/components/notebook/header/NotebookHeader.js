import React, { useState } from 'react';
import { Box, AppBar, Tabs, Tab } from '@mui/material';
import NotebookTitle from './NotebookTitle';
import NotebookKernel from './NotebookKernel';
import SparkApplicationId from './SparkApplicationId';
import { ContentType } from '../content/ContentType';

function NotebookHeader({
  setContentType,
  kernelId,
  sparkAppId,
  setSparkAppId,
  isNameEditing,
  currentName,
  isNotebookModified, 
  handleClickNotebookName,
  handleChangeNotebookName,
  handleSaveNotebookName,
  clearOutputs}) {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);

      if (newValue === 0) {
        setContentType(ContentType.CODE);
      } else if (newValue === 1) {
        setContentType(ContentType.Config);
      } else if (newValue === 2) {
        setContentType(ContentType.Runs);
      }
    };
  
    const a11yProps = (index) => {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    };

    return (
      <Box sx={{ 
        marginLeft: -3,
        position: 'sticky',
        top: 0, 
        zIndex: 1, 
        backgroundColor: 'white'
      }}> 
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ 
            backgroundColor: '#fff',
            borderBottom: '0.2px solid grey'
            }}>
            <Box sx={{ 
              display: 'flex',
              marginLeft: 3,
              }}>
              <Box>
                <Box sx={{ mt: 2 }}>
                    <NotebookTitle 
                      isNameEditing={isNameEditing}
                      currentName={currentName}
                      isNotebookModified={isNotebookModified}
                      handleClickNotebookName={handleClickNotebookName}
                      handleChangeNotebookName={handleChangeNotebookName}
                      handleSaveNotebookName={handleSaveNotebookName}
                      />
                </Box>
              </Box>

              <Box sx={{ 
                  display: 'flex',
                  marginLeft: 'auto', 
                  marginTop: 3,
                  justifyContent: 'flex-end' }}>
                <SparkApplicationId 
                  sparkAppId={sparkAppId}/>

                <NotebookKernel
                  kernelId={kernelId}
                  setSparkAppId={setSparkAppId}
                  clearOutputs={clearOutputs}/>
              </Box>
            </Box>

            <Box 
              sx={{ 
                marginLeft: 3,
                borderBottom: 0, 
                borderColor: 'divider' }}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                sx={{
                  height: '20px' 
                }}
                aria-label="basic tabs example">
                <Tab label="Code" 
                    {...a11yProps(0)}
                    sx={{ 
                      textTransform: 'none',
                      height: '20px' }} />
                <Tab label="Config"
                    {...a11yProps(1)} 
                    sx={{ 
                      textTransform: 'none',
                      height: '20px' }} />
                <Tab label="Runs" 
                    {...a11yProps(2)} 
                    sx={{ 
                      textTransform: 'none',
                      height: '20px' }} />
              </Tabs>
            </Box>

        </AppBar>
      </Box>
    );
}

export default NotebookHeader;