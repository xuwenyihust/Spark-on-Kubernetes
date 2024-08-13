import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Container, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import config from '../../config';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();

        const credentials = btoa(`${username}:${password}`);
        const response = await fetch(`${config.serverBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`,
            }
        });

        if (response.ok) {
            // The user is logged in
            // You might want to save the username and password in the session storage here
            // And redirect the user to the home page
            console.log('Logged in successfully');
            const data = await response.json();
            const token = data.access_token;
            const useremail = data.email;
            sessionStorage.setItem('token', token);
            onLogin(username, useremail, password);
        } else {
            // The login failed
            // You might want to show an error message here
            console.error('Failed to log in: ', response.text, response.status);
            setError(true);
        }
    };

    return (
      <Container component="main" maxWidth="xs">
        <Paper style={{ 
            marginTop: '100px',
            width: '300px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #ccc',
          }}>
          <Typography component="h1" variant="h5">
              Sign In
          </Typography>
          <form 
              style={{ 
                  width: '100%', 
                  marginTop: '1px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
              }}
            onSubmit={handleSubmit}>
              <TextField
                  label="Username"
                  value={username}
                  variant="outlined"
                  required
                  style={{ 
                      marginTop: '10px',
                  }}
                  onChange={e => setUsername(e.target.value)}
              />
              <TextField
                  label="Password"
                  type="password"
                  value={password}
                  variant="outlined"
                  required
                  style={{ 
                    marginTop: '10px',
                  }}
                  onChange={e => setPassword(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                style={{ 
                    marginTop: '10px',
                    marginBottom: '10px',
                }}>
                  Log in
              </Button>
          </form>
        </Paper>

        <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
          <Alert severity="error">Failed to log in</Alert>
        </Snackbar>
      </Container>
    );
}

export default LoginForm;