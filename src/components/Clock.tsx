import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Box sx={{ 
      marginLeft: 'auto', 
      padding: '8px 20px',
      borderRadius: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <AccessTimeIcon sx={{ fontSize: '1.2rem' }} />
      <Typography sx={{ 
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        color: '#fff'
      }}>
        {formattedTime}
      </Typography>
    </Box>
  );
};

export default Clock;