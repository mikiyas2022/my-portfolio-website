import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/slices/authSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import config from '../../config';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  
  // Reset password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: code, 3: new password
  const [resetError, setResetError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${config.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch(setToken(data.token));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleResetPassword = async () => {
    setResetError('');
    try {
      if (resetStep === 1) {
        // Send reset email
        const response = await fetch(`${config.apiUrl}/api/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: resetEmail }),
        });

        if (!response.ok) {
          throw new Error('Failed to send reset code');
        }

        setResetStep(2);
      } else if (resetStep === 2) {
        // Verify reset code
        const response = await fetch(`${config.apiUrl}/api/auth/verify-reset-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: resetEmail, code: resetCode }),
        });

        if (!response.ok) {
          throw new Error('Invalid reset code');
        }

        setResetStep(3);
      } else {
        // Set new password
        const response = await fetch(`${config.apiUrl}/api/auth/set-new-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: resetEmail,
            code: resetCode,
            newPassword,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to set new password');
        }

        setIsResetDialogOpen(false);
        setResetStep(1);
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
      }
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Reset password failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', top: 8, left: 8 }}
          onClick={() => navigate('/')}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 3 }}>
          Login
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Login
          </Button>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/register')}
            >
              Create an account
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setIsResetDialogOpen(true);
                setResetStep(1);
              }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={isResetDialogOpen} onClose={() => setIsResetDialogOpen(false)}>
        <DialogTitle>
          {resetStep === 1 && 'Reset Password'}
          {resetStep === 2 && 'Enter Verification Code'}
          {resetStep === 3 && 'Set New Password'}
        </DialogTitle>
        <DialogContent>
          {resetError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {resetError}
            </Typography>
          )}
          {resetStep === 1 && (
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              margin="normal"
              required
            />
          )}
          {resetStep === 2 && (
            <TextField
              fullWidth
              label="Verification Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              margin="normal"
              required
            />
          )}
          {resetStep === 3 && (
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResetPassword}>
            {resetStep === 1 && 'Send Code'}
            {resetStep === 2 && 'Verify Code'}
            {resetStep === 3 && 'Set Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login; 