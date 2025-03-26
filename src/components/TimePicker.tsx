import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [time, setTime] = useState(value);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    console.log("Time input:", newTime); // Log the time input for debugging
    
    try {
      // First, try to normalize the time format if it's a valid input
      if (newTime) {
        // This regex accepts both single and double-digit hours (0-23) and minutes (0-59)
        if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(newTime)) {
          // Format with leading zeros if needed
          const [hours, minutes] = newTime.split(':');
          const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
          setTime(formattedTime);
          onChange(formattedTime);
        } else {
          // If it's not a valid format, keep the current time
          console.error("Invalid time value:", newTime);
          // Don't update the time, which prevents the RangeError
        }
      } else {
        // Handle empty input
        setTime('00:00');
        onChange('00:00');
      }
    } catch (error) {
      console.error("Error processing time:", error);
      // Keep the current time to prevent errors
    }
  };

  return (
    <Form.Control
      type="time"
      value={time}
      onChange={handleTimeChange}
      className="form-control"
      placeholder="HH:mm"
    />
  );
};

export default TimePicker;