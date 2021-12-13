import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ConnectingAirportsOutlined } from '@mui/icons-material';

export default function SelectTimeInterval() {
  const [timeInterval, setTimeInterval] = React.useState('');

  const handleChange = (event) => {
    setTimeInterval(event.target.value);
    console.log("Interval:"+event.target.value.toString())
    // publish event.target.value to interval
    // TODO
    window.connetion.publish( "ALARM_TIMEOUT", event.target.value.toString(), 1)
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Interval</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={timeInterval}
          label="Time interval"
          onChange={handleChange}
        >
          <MenuItem value={30}>30 s</MenuItem>
          <MenuItem value={60}>1 min</MenuItem>
          <MenuItem value={120}>2 min</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
