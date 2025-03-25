import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [date, setDate] = useState<Date | null>(value);

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <DatePicker
      selected={date}
      onChange={handleDateChange}
      dateFormat="MMMM d, yyyy"
      className="form-control"
      placeholderText="Select date"
    />
  );
};

export default CustomDatePicker;