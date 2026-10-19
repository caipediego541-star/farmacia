
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
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  obtenerMedicamentos,
  obtenerMedicamento,
  crearMedicamento,
  actualizarMedicamento,
  eliminarMedicamento,
  obtenerCategorias,
} from '../../services/api.js'

import TituloSeccion from '../components/TituloSeccion.jsx'

const FORM_VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  fecha_vencimiento: '',
  categoria_id: '',
}

function validarFormulario(form) {
  const errores = {}

  if (!form.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio'
  } else if (form.nombre.trim().length > 150) {
    errores.nombre = 'El nombre no puede superar los 150 caracteres'
  }

  if (form.descripcion.trim().length > 255) {
    errores.descripcion =
      'La descripción no puede superar los 255 caracteres'
  }

  const precio = Number(form.precio)

  if (form.precio.trim() === '') {
    errores.precio = 'El precio es obligatorio'
  } else if (!Number.isFinite(precio) || precio <= 0) {
    errores.precio = 'El precio debe ser mayor a cero'
  }

  const stock = Number(form.stock)

  if (form.stock.trim() === '') {
    errores.stock = 'El stock es obligatorio'
  } else if (!Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock debe ser un entero igual o mayor a cero'
  }

  if (!form.fecha_vencimiento) {
    errores.fecha_vencimiento = 'La fecha de vencimiento es obligatoria'
  } else {
    const fecha = new Date(`${form.fecha_vencimiento}T00:00:00`)

    if (
      Number.isNaN(fecha.getTime()) ||
      fecha.toISOString().slice(0, 10) !== form.fecha_vencimiento
    ) {
      errores.fecha_vencimiento = 'Ingresá una fecha válida'
    }
  }

  if (!form.categoria_id) {
    errores.categoria_id = 'Seleccioná una categoría'
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

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(Number(precio))
}

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha'

  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState([])
  const [categorias, setCategorias] = useState([])

  const [cargando, setCargando] = useState(true)
  const [cargandoCategorias, setCargandoCategorias] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [errorCategorias, setErrorCategorias] = useState('')
  const [recarga, setRecarga] = useState(0)

  // Formulario para crear o modificar
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [erroresForm, setErroresForm] = useState({})
  const [guardando, setGuardando] = useState(false)

  // Detalle del medicamento
  const [detalle, setDetalle] = useState(null)

  // Confirmación de eliminación
  const [aEliminar, setAEliminar] = useState(null)

  // Mensajes de resultado
  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: '',
    tipo: 'success',
  })

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ abierto: true, texto, tipo })
  }

  // Cargar medicamentos desde la API
  useEffect(() => {
    setCargando(true)

    obtenerMedicamentos()
      .then((data) => {
        setMedicamentos(data)
        setErrorCarga('')
      })
      .catch((error) => {
        console.error('Error al cargar los medicamentos:', error)
        setErrorCarga('Error al cargar los medicamentos')
      })
      .finally(() => {
        setCargando(false)
      })
  }, [recarga])

  // Cargar las categorías reales para el selector
  useEffect(() => {
    obtenerCategorias()
      .then((data) => {
        setCategorias(data)
        setErrorCategorias('')
      })
      .catch((error) => {
        console.error('Error al cargar las categorías:', error)
        setErrorCategorias('No se pudieron cargar las categorías')
      })
      .finally(() => {
        setCargandoCategorias(false)
      })
  }, [])

  const recargarLista = () => {
    setRecarga((n) => n + 1)
  }

  const limpiarFormulario = () => {
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErroresForm({})
  }

  // Preparar el formulario para editar
  const iniciarEdicion = (medicamento) => {
    setEditandoId(medicamento.id)

    setForm({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion || '',
      precio: String(medicamento.precio),
      stock: String(medicamento.stock),
      fecha_vencimiento: medicamento.fecha_vencimiento || '',
      categoria_id: String(medicamento.categoria_id),
    })

    setErroresForm({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  // Crear o modificar un medicamento
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
      precio: Number(form.precio),
      stock: Number(form.stock),
      fecha_vencimiento: form.fecha_vencimiento,
      categoria_id: Number(form.categoria_id),
    }

    try {
      if (editandoId === null) {
        await crearMedicamento(datos)
        mostrarMensaje('Medicamento registrado correctamente')
      } else {
        await actualizarMedicamento(editandoId, datos)
        mostrarMensaje('Medicamento actualizado correctamente')
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

  // Consultar un medicamento y su categoría
  const verDetalle = async (id) => {
    try {
      const medicamento = await obtenerMedicamento(id)
      setDetalle(medicamento)
    } catch (error) {
      mostrarMensaje(error.message, 'error')
    }
  }

  // Eliminar un medicamento
  const confirmarEliminar = async () => {
    if (!aEliminar) return

    try {
      await eliminarMedicamento(aEliminar.id)

      if (editandoId === aEliminar.id) {
        limpiarFormulario()
      }

      mostrarMensaje('Medicamento eliminado correctamente')
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
        titulo="Gestión de medicamentos"
        subtitulo="Administrá los medicamentos, su stock, vencimientos y categorías."
      />

      {/* Formulario */}
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
            ? 'Registrar medicamento'
            : `Modificando medicamento #${editandoId}`}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            columnGap: 2,
            rowGap: 1,
          }}
        >
          <Campo
            etiqueta="Nombre:"
            placeholder="Nombre del medicamento y presentación"
            value={form.nombre}
            onChange={cambiarCampo('nombre')}
            error={erroresForm.nombre}
            inputProps={{ maxLength: 150 }}
          />

          <Campo
            etiqueta="Descripción:"
            placeholder="Presentación o descripción"
            value={form.descripcion}
            onChange={cambiarCampo('descripcion')}
            error={erroresForm.descripcion}
            inputProps={{ maxLength: 255 }}
          />

          <Campo
            etiqueta="Precio (ARS):"
            type="number"
            value={form.precio}
            onChange={cambiarCampo('precio')}
            error={erroresForm.precio}
            inputProps={{ min: 0.01, step: 0.01 }}
          />

          <Campo
            etiqueta="Stock:"
            type="number"
            value={form.stock}
            onChange={cambiarCampo('stock')}
            error={erroresForm.stock}
            inputProps={{ min: 0, step: 1 }}
          />

          <Campo
            etiqueta="Fecha de vencimiento:"
            type="date"
            value={form.fecha_vencimiento}
            onChange={cambiarCampo('fecha_vencimiento')}
            error={erroresForm.fecha_vencimiento}
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Categoría:
            </Typography>

            <FormControl
              size="small"
              fullWidth
              error={Boolean(erroresForm.categoria_id || errorCategorias)}
              disabled={cargandoCategorias || categorias.length === 0}
              sx={{ bgcolor: '#fff' }}
            >
              <InputLabel id="categoria-medicamento-label">
                Seleccioná una categoría
              </InputLabel>

              <Select
                labelId="categoria-medicamento-label"
                value={form.categoria_id}
                label="Seleccioná una categoría"
                onChange={cambiarCampo('categoria_id')}
              >
                {categorias.map((categoria) => (
                  <MenuItem
                    key={categoria.id}
                    value={String(categoria.id)}
                  >
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>
                {erroresForm.categoria_id ||
                  errorCategorias ||
                  (cargandoCategorias
                    ? 'Cargando categorías...'
                    : categorias.length === 0
                      ? 'No hay categorías disponibles'
                      : ' ')}
              </FormHelperText>
            </FormControl>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={guardar}
            disabled={
              guardando ||
              cargandoCategorias ||
              categorias.length === 0
            }
          >
            {guardando
              ? 'Guardando...'
              : editandoId === null
                ? 'Registrar medicamento'
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

      {/* Listado */}
      <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
        Medicamentos registrados
      </Typography>

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {errorCarga && (
        <Alert severity="error">{errorCarga}</Alert>
      )}

      {!cargando && !errorCarga && medicamentos.length === 0 && (
        <Alert severity="info">
          No hay medicamentos registrados.
        </Alert>
      )}

      {!cargando && !errorCarga && medicamentos.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" sx={{ minWidth: 950 }}>
            <TableHead sx={{ bgcolor: '#ecf7f2' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vencimiento</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {medicamentos.map((medicamento) => (
                <TableRow key={medicamento.id} hover>
                  <TableCell>{medicamento.id}</TableCell>
                  <TableCell>{medicamento.nombre}</TableCell>
                  <TableCell>
                    {medicamento.categoria_nombre || 'Sin categoría'}
                  </TableCell>
                  <TableCell>
                    {formatearPrecio(medicamento.precio)}
                  </TableCell>
                  <TableCell>{medicamento.stock}</TableCell>
                  <TableCell>
                    {formatearFecha(medicamento.fecha_vencimiento)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={() => verDetalle(medicamento.id)}
                      >
                        Ver
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() => iniciarEdicion(medicamento)}
                      >
                        Editar
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => setAEliminar(medicamento)}
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

      {/* Detalle del medicamento */}
      <Dialog
        open={Boolean(detalle)}
        onClose={() => setDetalle(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle del medicamento</DialogTitle>

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
                <b>Precio:</b> {formatearPrecio(detalle.precio)}
              </Typography>
              <Typography>
                <b>Stock:</b> {detalle.stock}
              </Typography>
              <Typography>
                <b>Fecha de vencimiento:</b>{' '}
                {formatearFecha(detalle.fecha_vencimiento)}
              </Typography>
              <Typography>
                <b>Categoría:</b>{' '}
                {detalle.categoria_nombre || 'Sin categoría'}
              </Typography>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetalle(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de eliminación */}
      <Dialog
        open={Boolean(aEliminar)}
        onClose={() => setAEliminar(null)}
      >
        <DialogTitle>Eliminar medicamento</DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que querés eliminar el medicamento{' '}
            <b>{aEliminar?.nombre}</b>?
            {' '}Esta acción no se puede deshacer.
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

export default MedicamentosPage
