import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Link,
  Paper,
} from '@mui/material';
import { AccountCircle, Email, Lock } from '@mui/icons-material';

const InputField = ({ icon: Icon, label, name, type, value, onChange }) => (
  <TextField
    fullWidth
    variant="outlined"
    margin="normal"
    required
    label={label}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: <Icon color="action" sx={{ mr: 1 }} />,
    }}
  />
);

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box component="img" src="/api/placeholder/80/80" alt="University Logo" sx={{ width: 80, height: 80, mb: 2 }} />
      <Typography component="h1" variant="h5" gutterBottom>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <InputField
          icon={AccountCircle}
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          icon={Email}
          label="Email ID"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          icon={Lock}
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Role</FormLabel>
          <RadioGroup
            aria-label="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="cdc" control={<Radio />} label="CDC Cell" />
            <FormControlLabel value="student" control={<Radio />} label="Student" />
          </RadioGroup>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const SignUp = () => (
  <Grid container component="main" sx={{ height: '100vh' }}>
    <Grid
      item
      xs={false}
      sm={4}
      md={7}
      sx={{
        backgroundImage: 'url(/api/placeholder/800/600)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography component="h1" variant="h3" color="white" fontWeight="bold">
          Pandit Deendayal Petroleum University
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <SignUpForm />
      </Container>
    </Grid>
  </Grid>
);

export default SignUp;