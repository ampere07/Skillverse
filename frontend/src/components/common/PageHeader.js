import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              component="button"
              variant="body2"
              onClick={() => navigate(crumb.path)}
              sx={{
                textDecoration: 'none',
                color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="500" color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {action && (
          <Box sx={{ ml: 2 }}>
            {action}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;