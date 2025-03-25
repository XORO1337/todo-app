import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  Modal, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Paper,
  Stack,
  SelectChangeEvent
} from '@mui/material';
// Use react-datepicker instead of MUI date pickers since they're not installed
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch } from '../store';
import { addTodo } from '../store/reducers/todoReducer';
import { v4 as uuidv4 } from 'uuid';
import { getWeatherByLocation } from '../services/weatherService';

const TaskInput: React.FC = () => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [pendingTodoText, setPendingTodoText] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() === '') return;
    
    setPendingTodoText(text);
    setShowLocationModal(true);
  };

  const createTodo = (todoText: string, location?: string, weather?: any) => {
    const newTodo = {
      id: uuidv4(),
      text: todoText,
      completed: false,
      priority,
      tags: [...tags],
      location,
      weather,
      createdAt: new Date().toISOString(),
      scheduledDateTime: scheduledDateTime ? scheduledDateTime.toISOString() : null
    };
    
    dispatch(addTodo(newTodo));
    
    // Reset form
    setText('');
    setPriority('Medium');
    setTags([]);
    setTagInput('');
    setPendingTodoText('');
    setScheduledDateTime(null);
  };

  const handleAddTag = (e?: React.FormEvent) => {
    // Prevent form submission if called from a key press event
    if (e) e.preventDefault();
    
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleLocationSubmit = async () => {
    if (manualLocation.trim()) {
      try {
        const weatherData = await getWeatherByLocation(manualLocation);
        createTodo(pendingTodoText, manualLocation, weatherData);
      } catch (error) {
        console.error('Error getting weather for manual location:', error);
        createTodo(pendingTodoText);
      }
    } else {
      createTodo(pendingTodoText);
    }
    
    setShowLocationModal(false);
    setManualLocation('');
  };

  const handleSkipLocation = () => {
    createTodo(pendingTodoText);
    setShowLocationModal(false);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (scheduledDateTime) {
      const [hours, minutes] = e.target.value.split(':');
      const newDate = new Date(scheduledDateTime);
      newDate.setHours(parseInt(hours));
      newDate.setMinutes(parseInt(minutes));
      setScheduledDateTime(newDate);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Create New Task
        </Typography>
        
        <TextField
          fullWidth
          label="Add a new task"
          variant="outlined"
          placeholder="Enter your task"
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e: SelectChangeEvent) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Schedule Date</Typography>
        <DatePicker
          selected={scheduledDateTime}
          onChange={(date: Date | null) => setScheduledDateTime(date)}
          dateFormat="MMMM d, yyyy"
          className="form-control"
          placeholderText="Select date"
        />
        
        {scheduledDateTime && (
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Schedule Time</Typography>
            <TextField
              type="time"
              value={scheduledDateTime ? scheduledDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
              onChange={handleTimeChange}
              fullWidth
              variant="outlined"
              placeholder="HH:mm"
            />
          </Box>
        )}
        
        <Box sx={{ display: 'flex', mb: 2, mt: 3 }}>
          <TextField
            fullWidth
            label="Add a tag"
            variant="outlined"
            value={tagInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
            onKeyPress={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && handleAddTag(e)}
            sx={{ mr: 1 }}
          />
          <Button variant="outlined" onClick={() => handleAddTag()}>
            Add Tag
          </Button>
        </Box>
        
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
        
        <Button 
          variant="contained" 
          type="submit" 
          fullWidth
          disabled={!text.trim()}
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      </Box>
      
      {/* Modal for manual location input */}
      <Modal 
        open={showLocationModal} 
        onClose={handleSkipLocation}
        aria-labelledby="location-modal-title"
        aria-describedby="location-modal-description"
      >
        <Paper 
          sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            p: 4,
            outline: 'none',
            borderRadius: 2
          }}
        >
          <Typography id="location-modal-title" variant="h6" component="h2" gutterBottom>
            Add Location
          </Typography>
          
          <Typography id="location-modal-description" variant="body2" sx={{ mb: 3 }}>
            Please add a location for your task to get weather information.
          </Typography>
          
          <TextField
            autoFocus
            type="text"
            placeholder="Enter location (e.g., New York, London)"
            value={manualLocation}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setManualLocation(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handleSkipLocation}>
              Skip
            </Button>
            <Button 
              variant="contained" 
              onClick={handleLocationSubmit}
              disabled={manualLocation.trim() === ''}
            >
              Add Location
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default TaskInput;