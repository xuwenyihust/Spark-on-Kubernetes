
import React, { useEffect, useState } from 'react';
import { Box, Card, CardHeader, CardContent, CardActions, Button, Typography, List, ListItem, ListItemText, TextField, Select, MenuItem } from '@mui/material';
import SparkAppConfigModel from '../../../models/SparkAppConfigModel';

function Config({ notebook, notebookPath }) {

  const [loading, setLoading] = useState(true);

  const [executorCores, setExecutorCores] = useState(null);
  const [executorInstances, setExecutorInstances] = useState(null);

  const [executorMemory, setExecutorMemory] = useState(null);
  const [executorMemoryUnit, setExecutorMemoryUnit] = useState('m');

  useEffect(() => {
    const fetchSparkConfig = async () => {
      setLoading(true); 
      const config = await SparkAppConfigModel.getSparkAppConfigByNotebookPath(notebookPath);
      console.log('config: ', config);

      setExecutorCores(config.executor_cores);
      setExecutorInstances(config.executor_instances);
      setExecutorMemory(config.executor_memory);
      setExecutorMemoryUnit(config.executor_memory_unit);

      setLoading(false); 
    };
    fetchSparkConfig();
  }, [notebookPath, notebook]);

  const handleExecutorMemoryUnitChange = (event) => {
    setExecutorMemoryUnit(event.target.value);
  };

  const handleSave = () => {
    console.log('executorCores:', executorCores);
    console.log('executorInstances:', executorInstances);
    console.log('executorMemory:', executorMemory + executorMemoryUnit);

    const sparkAppConfig = {
      'spark.executor.cores': executorCores,
      'spark.executor.instances': executorInstances,
      'spark.executor.memory': executorMemory + executorMemoryUnit,
      'spark.executor.memoryOverhead': '1g',
      'saprk.executor.memory.fraction': '0.8',
      'spark.driver.cores': 1,
      'spark.driver.memory': '1g',
      'spark.driver.memoryOverhead': '1g',
      'spark.dynamicAllocation.enabled': false,
      'spark.dynamicAllocation.minExecutors': 1,
      'spark.dynamicAllocation.maxExecutors': 1,
      'spark.shuffle.service.enabled': false,
    };

    SparkAppConfigModel.updateSparkAppConfig(notebookPath, sparkAppConfig);
  }

  if (loading) {
    return <div>Loading...</div>;
  } else {
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
                <ListItemText primary="spark.executor.memory" />
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
                <ListItemText primary="spark.executor.cores" />
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
}

export default Config;