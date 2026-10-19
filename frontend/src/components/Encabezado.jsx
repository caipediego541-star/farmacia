import { Box, Typography } from '@mui/material'

function Encabezado() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
        color: '#fff',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        mb: 3,
        boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          flexShrink: 0,
        }}
      >
      </Box>
      <Box>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          Gestión de Farmacia
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Sistema de gestión de medicamentos, categorías y empleados
        </Typography>
      </Box>
    </Box>
  )
}

export default Encabezado