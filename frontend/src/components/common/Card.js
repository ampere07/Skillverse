import React from 'react';
import { Card as MuiCard, CardContent, CardActions, Typography, Box } from '@mui/material';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  elevation = 1,
  hover = true,
  onClick,
  sx = {},
  ...props
}) => {
  return (
    <MuiCard
      elevation={elevation}
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 8px -2px rgba(0,0,0,0.2), 0px 8px 16px 0px rgba(0,0,0,0.14), 0px 2px 20px 0px rgba(0,0,0,0.12)',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {title && (
          <Box sx={{ mb: subtitle ? 1 : 2 }}>
            <Typography variant="h6" component="h2" fontWeight="500">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        {children}
      </CardContent>
      
      {actions && (
        <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;