import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAppSelector } from '../store';
import { showNotification } from '../services/notificationService';

interface TaskNotificationProps {}

const TaskNotification: React.FC<TaskNotificationProps> = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentTask, setCurrentTask] = useState<{
    id: string;
    text: string;
  } | null>(null);
  
  const { todos } = useAppSelector(state => state.todos);
  
  // Check for due tasks every minute
  useEffect(() => {
    const checkScheduledTasks = () => {
      const now = new Date();
      // Set seconds and milliseconds to 0 for more reliable comparison
      now.setSeconds(0);
      now.setMilliseconds(0);
      
      // Find tasks that are scheduled for the current time
      const dueTasks = todos.filter(todo => {
        if (!todo.scheduledDateTime) return false;
        
        const scheduledTime = new Date(todo.scheduledDateTime);
        // Set seconds and milliseconds to 0 for comparison
        scheduledTime.setSeconds(0);
        scheduledTime.setMilliseconds(0);
        
        // Check if the scheduled time matches the current time
        return scheduledTime.getTime() === now.getTime();
      });
      
      // If there are due tasks, show notification for the first one
      if (dueTasks.length > 0) {
        setCurrentTask({
          id: dueTasks[0].id,
          text: dueTasks[0].text
        });
        setShowNotification(true);
        setShowNotification(true);
      }
    };
    
    // Check immediately when component mounts
    checkScheduledTasks();
    
    // Set up interval to check every minute
    const intervalId = setInterval(checkScheduledTasks, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [todos]);
  
  const handleClose = () => {
    setShowNotification(false);
    setCurrentTask(null);
  };
  
  return (
    <Modal 
      show={showNotification} 
      onHide={handleClose}
      centered
      animation
    >
      <Modal.Header closeButton>
        <Modal.Title>Task Reminder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-center">
          <i className="bi bi-alarm me-2 fs-4 text-warning"></i>
          <p className="mb-0">It's time for your task: <strong>{currentTask?.text}</strong></p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Dismiss
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskNotification;