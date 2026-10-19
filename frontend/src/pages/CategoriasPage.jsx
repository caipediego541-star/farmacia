import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

import {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../../services/api.js'

import TituloSeccion from '../components/TituloSeccion.jsx'

const FORM_VACIO = {
  nombre: '',
  descripcion: '',
}

function validarFormulario(form) {
  const errores = {}

  if (!form.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio'
  } else if (form.nombre.trim().length > 100) {
    errores.nombre = 'El nombre no puede superar los 100 caracteres'
  }

  if (form.descripcion.trim().length > 255) {
    errores.descripcion =
      'La descripción no puede superar los 255 caracteres'
  }

  return errores
}

function Campo({ etiqueta, error, ...props }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
        {etiqueta}
      </Typography>

      <TextField
        size="small"
        fullWidth
        error={Boolean(error)}
        helperText={error || ' '}
        sx={{ bgcolor: '#fff' }}
        {...props}
      />
    </Box>
  )
}

function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [recarga, setRecarga] = useState(0)

  // Estado del formulario
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [erroresForm, setErroresForm] = useState({})
  const [guardando, setGuardando] = useState(false)

  // Detalle de una categoría
  const [detalle, setDetalle] = useState(null)

  // Confirmación de eliminación
  const [aEliminar, setAEliminar] = useState(null)

  // Mensajes de éxito y error
  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: '',
    tipo: 'success',
  })

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ abierto: true, texto, tipo })
  }

  // Listar categorías
  useEffect(() => {
    setCargando(true)

    obtenerCategorias()
      .then((data) => {
        setCategorias(data)
        setErrorCarga('')
      })
      .catch((error) => {
        console.error('Error al cargar las categorías:', error)
        setErrorCarga('Error al cargar las categorías')
      })
      .finally(() => {
        setCargando(false)
      })
  }, [recarga])

  const recargarLista = () => {
    setRecarga((n) => n + 1)
  }

  const limpiarFormulario = () => {
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErroresForm({})
  }

  // Preparar el formulario para editar
  const iniciarEdicion = (categoria) => {
    setEditandoId(categoria.id)

    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
    })

    setErroresForm({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Actualizar los campos del formulario
  const cambiarCampo = (campo) => (evento) => {
    setForm((anterior) => ({
      ...anterior,
      [campo]: evento.target.value,
    }))

    setErroresForm((anteriores) => ({
      ...anteriores,
      [campo]: '',
    }))
  }

  // Crear o modificar una categoría
  const guardar = async () => {
    const errores = validarFormulario(form)

    if (Object.keys(errores).length > 0) {
      setErroresForm(errores)
      return
    }

    setGuardando(true)

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
    }

    try {
      if (editandoId === null) {
        await crearCategoria(datos)
        mostrarMensaje('Categoría creada correctamente')
      } else {
        await actualizarCategoria(editandoId, datos)
        mostrarMensaje('Categoría actualizada correctamente')
      }

      limpiarFormulario()
      recargarLista()
    } catch (error) {
      if (error.errores && Object.keys(error.errores).length > 0) {
        setErroresForm(error.errores)
      } else {
        mostrarMensaje(error.message, 'error')
      }
    } finally {
      setGuardando(false)
    }
  }

  // Consultar una categoría y sus medicamentos asociados
  const verDetalle = async (id) => {
    try {
      const categoria = await obtenerCategoria(id)
      setDetalle(categoria)
    } catch (error) {
      mostrarMensaje(error.message, 'error')
    }
  }

  // Eliminar una categoría
  const confirmarEliminar = async () => {
    if (!aEliminar) return

    try {
      await eliminarCategoria(aEliminar.id)

      if (editandoId === aEliminar.id) {
        limpiarFormulario()
      }

      mostrarMensaje('Categoría eliminada correctamente')
      recargarLista()
    } catch (error) {
      mostrarMensaje(error.message, 'error')
    } finally {
      setAEliminar(null)
    }
  }

  return (
    <Box>
      <TituloSeccion
        titulo="Gestión de categorías"
        subtitulo="Organizá los grupos de medicamentos de la farmacia."
      />

      {/* Formulario para crear o editar */}
      <Box
        sx={{
          bgcolor: '#f8fafb',
          border: '1px solid #e3e8ec',
          borderRadius: 2,
          p: 3,
          mb: 4,
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          {editandoId === null
            ? 'Nueva categoría'
            : `Modificando categoría #${editandoId}`}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            columnGap: 2,
          }}
        >
          <Campo
            etiqueta="Nombre:"
            placeholder="Ingresá el nombre de la categoría"
            value={form.nombre}
            onChange={cambiarCampo('nombre')}
            error={erroresForm.nombre}
            inputProps={{ maxLength: 100 }}
          />

          <Campo
            etiqueta="Descripción:"
            placeholder="Ingresá una descripción"
            value={form.descripcion}
            onChange={cambiarCampo('descripcion')}
            error={erroresForm.descripcion}
            multiline
            minRows={2}
            inputProps={{ maxLength: 255 }}
          />
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={guardar}
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : editandoId === null
                ? 'Crear categoría'
                : 'Guardar cambios'}
          </Button>

          {editandoId !== null && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={limpiarFormulario}
              disabled={guardando}
            >
              Cancelar edición
            </Button>
          )}
        </Stack>
      </Box>

      {/* Tabla de categorías */}
      <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
        Categorías registradas
      </Typography>

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {errorCarga && (
        <Alert severity="error">{errorCarga}</Alert>
      )}

      {!cargando && !errorCarga && categorias.length === 0 && (
        <Alert severity="info">
          No hay categorías registradas.
        </Alert>
      )}

      {!cargando && !errorCarga && categorias.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ bgcolor: '#ecf7f2' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Medicamentos asociados
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id} hover>
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>
                    {categoria.descripcion || 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    {categoria.cantidad_medicamentos ?? 0}
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={() => verDetalle(categoria.id)}
                      >
                        Ver
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() => iniciarEdicion(categoria)}
                      >
                        Editar
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => setAEliminar(categoria)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Ventana de detalle */}
      <Dialog
        open={Boolean(detalle)}
        onClose={() => setDetalle(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de categoría</DialogTitle>

        <DialogContent>
          {detalle && (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              <Typography>
                <b>ID:</b> {detalle.id}
              </Typography>

              <Typography>
                <b>Nombre:</b> {detalle.nombre}
              </Typography>

              <Typography>
                <b>Descripción:</b>{' '}
                {detalle.descripcion || 'Sin descripción'}
              </Typography>

              <Typography>
                <b>Cantidad de medicamentos:</b>{' '}
                {detalle.cantidad_medicamentos ?? 0}
              </Typography>

              <Typography sx={{ fontWeight: 700, mt: 1 }}>
                Medicamentos asociados
              </Typography>

              {detalle.medicamentos?.length > 0 ? (
                <Stack spacing={1}>
                  {detalle.medicamentos.map((medicamento) => (
                    <Box
                      key={medicamento.id}
                      sx={{
                        border: '1px solid #e3e8ec',
                        borderRadius: 1,
                        p: 1.5,
                      }}
                    >
                      <Typography>{medicamento.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {medicamento.stock}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">
                  Esta categoría no tiene medicamentos asociados.
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetalle(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar eliminación */}
      <Dialog
        open={Boolean(aEliminar)}
        onClose={() => setAEliminar(null)}
      >
        <DialogTitle>Eliminar categoría</DialogTitle>

        <DialogContent>
          <DialogContentText>
  ¿Estás seguro de que querés eliminar la categoría{' '}
  <b>{aEliminar?.nombre}</b>?

  {aEliminar?.cantidad_medicamentos > 0 ? (
    <>
      {' '}Esta categoría tiene {aEliminar.cantidad_medicamentos}{' '}
      {aEliminar.cantidad_medicamentos === 1
        ? 'medicamento asociado'
        : 'medicamentos asociados'}.
      {' '}Esta categoria no se puede eliminar porque tiene medicamentos asociados.
      Para  eliminarla, primero debés eliminar o reasignar los medicamentos asociados.
      
    </>
  ) : (
    <>
      {' '}Esta categoría no tiene medicamentos asociados y se
      puede eliminar. Esta acción no se puede deshacer.
    </>
  )}
</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAEliminar(null)}>
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmarEliminar}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensajes de éxito y error */}
      <Snackbar
        open={mensaje.abierto}
        autoHideDuration={4000}
        onClose={() =>
          setMensaje((anterior) => ({
            ...anterior,
            abierto: false,
          }))
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={mensaje.tipo}
          variant="filled"
          onClose={() =>
            setMensaje((anterior) => ({
              ...anterior,
              abierto: false,
            }))
          }
        >
          {mensaje.texto}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CategoriasPage