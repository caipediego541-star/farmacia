import { Box, Typography } from '@mui/material'

function TituloSeccion({ titulo, subtitulo }) {
  return (
    <Box sx={{ borderLeft: '5px solid', borderColor: 'primary.main', pl: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
        {titulo}
      </Typography>
      {subtitulo && (
        <Typography variant="body2" color="text.secondary">
          {subtitulo}
        </Typography>
      )}
    </Box>
  )
}

export default TituloSeccion
