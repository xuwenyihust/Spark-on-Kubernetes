
import React, { useEffect, useState } from 'react';
import { Box, Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText, TextField } from '@mui/material';

function Config({ }) {

  const [executorMemory, setExecutorMemory] = useState('512m');
  const [executorCores, setExecutorCores] = useState('1');
  const [executorInstances, setExecutorInstances] = useState('1');

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
                onChange={(e) => setExecutorMemory(e.target.value)}/>
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
      </Card>
    </Box>
  );
}

export default Config;