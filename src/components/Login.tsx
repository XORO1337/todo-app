import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Alert, 
  Container, 
  Grid,
  Paper, 
  Typography, 
  Box,
  FormHelperText
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/reducers/authReducer';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: any) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      dispatch(loginFailure('Username and password are required'));
      return;
    }
    
    // Simulate authentication process
    dispatch(loginStart());
    
    // Mock API call with timeout
    setTimeout(() => {
      // For demo purposes, accept any non-empty username/password
      // In a real app, this would be an actual API call to a backend
      if (username && password) {
        dispatch(loginSuccess({ username }));
      } else {
        dispatch(loginFailure('Invalid credentials'));
      }
    }, 1000);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login to Your Todo App
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <FormHelperText sx={{ mb: 2 }}>
            For demo purposes, any non-empty password will work.
          </FormHelperText>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;