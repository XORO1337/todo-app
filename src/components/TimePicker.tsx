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
    // Basic validation for time format
    if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
      setTime(newTime);
      onChange(newTime);
    } else {
      setTime('00:00');
      onChange('00:00');
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