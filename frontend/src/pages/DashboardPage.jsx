import { useEffect, useState } from 'react'
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material'
import { obtenerResumen } from '../../services/api.js'
import TituloSeccion from '../components/TituloSeccion.jsx'

function TarjetaResumen({ icono, titulo, valor, color }) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, textAlign: 'center', borderTop: '5px solid', borderTopColor: color }}
    >
      <Typography sx={{ fontSize: 36 }}>{icono}</Typography>
      <Typography variant="h3" sx={{ fontWeight: 700, color }}>
        {valor}
      </Typography>
      <Typography color="text.secondary">{titulo}</Typography>
    </Paper>
  )
}

function DashboardPage() {
  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerResumen()
      .then((data) => setResumen(data))
      .catch((err) => {
        console.error('Error al cargar el dashboard:', err)
        setError('❌ Error al cargar el dashboard')
      })
      .finally(() => setCargando(false))
  }, [])

  return (
    <Box>
      <TituloSeccion
        titulo="📊 Dashboard"
        subtitulo="Resumen general de la farmacia:"
      />

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {resumen && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2,
          }}
        >
          <TarjetaResumen
            icono="💊"
            titulo="Medicamentos"
            valor={resumen.total_medicamentos}
            color="#059669"
          />
          <TarjetaResumen
            icono="📂"
            titulo="Categorías"
            valor={resumen.total_categorias}
            color="#2196f3"
          />
          <TarjetaResumen
            icono="👨‍💼"
            titulo="Empleados"
            valor={resumen.total_empleados}
            color="#f59e0b"
          />
        </Box>
      )}
    </Box>
  )
}

export default DashboardPage