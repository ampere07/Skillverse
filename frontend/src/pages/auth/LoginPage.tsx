import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  Avatar,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School,
  Person,
  Code,
  TrendingUp,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const features = [
    {
      icon: <Code sx={{ color: '#1976d2' }} />,
      title: 'Interactive Coding',
      description: 'Write, compile, and test your Java code in real-time',
    },
    {
      icon: <TrendingUp sx={{ color: '#4caf50' }} />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics',
    },
    {
      icon: <Person sx={{ color: '#9c27b0' }} />,
      title: 'Personalized Learning',
      description: 'AI-powered recommendations tailored to your skill level',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          {/* Left Side - Branding & Features */}
          <Box sx={{ color: 'white', display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ mb: 6 }}>
              <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    mr: 3,
                  }}
                >
                  <School sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    SkillVerse
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Master Java Programming
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.95, lineHeight: 1.4 }}>
                The modern way to learn computer science with interactive coding, real-time feedback, and AI-powered insights.
              </Typography>
            </Box>

            <Stack spacing={3}>
              {features.map((feature, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                      {feature.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* Right Side - Login Form */}
          <Box>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <CardContent sx={{ p: 5 }}>
                {/* Mobile Logo */}
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4,
                  }}
                >
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', mr: 2 }}>
                    <School />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    SkillVerse
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Welcome Back! 👋
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Sign in to continue your learning journey
                  </Typography>
                </Box>

                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />

                    <TextField
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              sx={{ color: 'action.active' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                          boxShadow: '0 6px 24px rgba(25, 118, 210, 0.4)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Stack>
                </form>

                <Divider sx={{ my: 4 }}>
                  <Chip label="New to SkillVerse?" size="small" />
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Don't have an account yet?
                  </Typography>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.2)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Create Account
                  </Button>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
