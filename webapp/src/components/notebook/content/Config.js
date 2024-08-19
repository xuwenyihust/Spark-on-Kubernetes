
import React, { useEffect, useState } from 'react';
import { Box, Card, CardHeader, CardContent, CardActions, Button, Typography, List, ListItem, ListItemText, TextField, Select, MenuItem } from '@mui/material';

function Config({ }) {

  const [executorCores, setExecutorCores] = useState('1');
  const [executorInstances, setExecutorInstances] = useState('1');

  const [executorMemory, setExecutorMemory] = useState('512');
  const [executorMemoryUnit, setExecutorMemoryUnit] = useState('m');

  const handleExecutorMemoryUnitChange = (event) => {
    setExecutorMemoryUnit(event.target.value);
  };

  const handleSave = () => {
    console.log('executorCores:', executorCores);
    console.log('executorInstances:', executorInstances);
    console.log('executorMemory:', executorMemory + executorMemoryUnit);
  }

  return (
    <Box sx={{
      marginTop: 5,
      marginRight: 5,
      marginLeft: 2,
    }}>
      <Card 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
        }}>
        <CardHeader 
          title={
            <Typography 
              variant="body1"
              style={{ marginLeft: 10 }}
              color="textSecondary">
              Spark Configuration
            </Typography>
          }
          sx={{
            backgroundColor: '#f5f5f5',
            borderBottom: 1,
            borderBottomColor: '#f5f5f5',
          }}/>
        <CardContent>
          <List>
            <ListItem>
              <ListItemText primary="executor.memory" />
              <TextField 
                defaultValue={executorMemory}
                variant="outlined"
                size="small" 
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                onChange={(e) => {
                  setExecutorMemory(e.target.value)
                  }}/>
              <Box m={1} />
              <Select value={executorMemoryUnit}
                size="small"
                onChange={handleExecutorMemoryUnitChange}>
                <MenuItem value={'m'}>MB</MenuItem>
                <MenuItem value={'g'}>GB</MenuItem>
              </Select>
            </ListItem>

            <ListItem>
              <ListItemText primary="executor.cores" />
              <TextField 
                defaultValue={executorCores}
                variant="outlined"
                size="small"
                onChange={(e) => setExecutorCores(e.target.value)} />
            </ListItem>

            <ListItem>
              <ListItemText primary="spark.executor.instances" />
              <TextField
                defaultValue={executorInstances}
                variant="outlined"
                size="small" 
                onChange={(e) => setExecutorInstances(e.target.value)}/>
            </ListItem>
          </List>
        </CardContent>
        <CardActions>
          <Button 
            variant="outlined" 
            style={{ 
              marginLeft: '20px',
              borderColor: 'lightgrey', 
              color: 'grey' }}
            onClick={handleSave}>
            Save
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default Config;