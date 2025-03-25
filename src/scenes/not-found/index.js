import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../../theme';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      p={3}
    >
      <ErrorOutlineIcon sx={{ fontSize: '100px', color: colors.redAccent[500], mb: 2 }} />
      <Typography variant="h1" color={colors.grey[100]} gutterBottom>
        404
      </Typography>
      <Typography variant="h2" color={colors.grey[100]} gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="h5" color={colors.grey[400]} sx={{ mb: 4, maxWidth: '500px' }}>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="secondary"
        size="large"
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;