import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { obtenerCategorias } from '../../services/api.js'
import TituloSeccion from '../components/TituloSeccion.jsx'

// Código que ya existía en App.jsx, movido a su propia página
function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerCategorias()
      .then((data) => setCategorias(data))
      .catch((err) => {
        console.error('Error al conectar con la API:', err)
        setError('❌ Error al cargar las categorías')
      })
      .finally(() => setCargando(false))
  }, [])

  return (
    <Box>
      <TituloSeccion
        titulo="📂 Categorías"
        subtitulo="Categorías de medicamentos registradas:"
      />

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!cargando && !error && categorias.length === 0 && (
        <Alert severity="info">No hay categorías registradas.</Alert>
      )}

      {!cargando && !error && categorias.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ bgcolor: '#ecf7f2' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id} hover>
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>{categoria.descripcion || 'Sin descripción'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default CategoriasPage
