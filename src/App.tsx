import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from './store';
import { logout } from './store/reducers/authReducer';
import Login from './components/Login';
import TaskInput from './components/TaskInput';
import Clock from './components/Clock';
import TaskList from './components/TaskList';
import TaskNotification from './components/TaskNotification';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="App">
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left', ml: -4 }}>
              Advanced Todo App
            </Typography>
            {isAuthenticated && user && (
              <>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Welcome, {user.username}!
                </Typography>
                <Button color="inherit" variant="outlined" size="small" onClick={handleLogout}>
                  Logout
                </Button>
                <Box sx={{ ml: 'auto' }}>
                  <Clock />
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container>
        {isAuthenticated ? (
          <>
            <TaskInput />
            <hr className="my-4" />
            <TaskList />
            <TaskNotification />
          </>
        ) : (
          <Login />
        )}
      </Container>
    </div>
  );
}

export default App;