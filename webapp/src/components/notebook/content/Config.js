
import { Box, Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText, TextField } from '@mui/material';

function Config({ }) {

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
              <TextField label="512m" variant="outlined" />
            </ListItem>

            <ListItem>
              <ListItemText primary="executor.cores" />
              <TextField label="1" variant="outlined" />
            </ListItem>

            <ListItem>
              <ListItemText primary="spark.executor.instances" />
              <TextField label="1" variant="outlined" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Config;