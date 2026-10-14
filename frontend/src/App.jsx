import { useState, useEffect } from 'react'
import { obtenerCategorias } from '../services/api.js'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import './App.css'

function App() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerCategorias()
      .then((data) => setCategorias(data))
      .catch((error) => {
        console.error('Error al conectar con la API:', error)
        setError('No se pudieron cargar las categorías')
      })
      .finally(() => setCargando(false))
  }, [])

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sistema de Gestión para Farmacia
      </Typography>

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Categorías
      </Typography>

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {!cargando && !error && categorias.length === 0 && (
        <Alert severity="info">
          No hay categorías registradas.
        </Alert>
      )}

      {!cargando && !error && categorias.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>
                    {categoria.descripcion || 'Sin descripción'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default App