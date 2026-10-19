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
  obtenerEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from '../../services/api.js'
import TituloSeccion from '../components/TituloSeccion.jsx'

const FORM_VACIO = { nombre: '', apellido: '', dni: '', email: '', cargo: '' }
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Validaciones del lado del frontend (el backend valida lo mismo)
function validarFormulario(form) {
  const errores = {}

  if (!form.nombre.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!form.apellido.trim()) errores.apellido = 'El apellido es obligatorio'

  if (!form.dni.trim()) {
    errores.dni = 'El DNI es obligatorio'
  } else if (!/^\d{7,8}$/.test(form.dni.trim())) {
    errores.dni = 'El DNI debe tener 7 u 8 números'
  }

  if (!form.email.trim()) {
    errores.email = 'El email es obligatorio'
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errores.email = 'El email no es válido'
  }

  if (!form.cargo.trim()) errores.cargo = 'El cargo es obligatorio'

  return errores
}

// Campo con la etiqueta arriba, como en el diseño de referencia
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

function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [recarga, setRecarga] = useState(0)

  // Formulario (crear / editar)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [erroresForm, setErroresForm] = useState({})
  const [guardando, setGuardando] = useState(false)

  // Detalle (consultar)
  const [detalle, setDetalle] = useState(null)

  // Confirmación de eliminación
  const [aEliminar, setAEliminar] = useState(null)

  // Mensajes (Snackbar)
  const [mensaje, setMensaje] = useState({ abierto: false, texto: '', tipo: 'success' })

  const mostrarMensaje = (texto, tipo = 'success') =>
    setMensaje({ abierto: true, texto, tipo })

  // Listar empleados
  useEffect(() => {
    obtenerEmpleados()
      .then((data) => {
        setEmpleados(data)
        setErrorCarga('')
      })
      .catch((error) => {
        console.error('Error al cargar los empleados:', error)
        setErrorCarga('❌ Error al cargar los empleados')
      })
      .finally(() => setCargando(false))
  }, [recarga])

  const recargarLista = () => setRecarga((n) => n + 1)

  const limpiarFormulario = () => {
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErroresForm({})
  }

  // Modificar: carga el empleado en el formulario
  const iniciarEdicion = (empleado) => {
    setEditandoId(empleado.id)
    setForm({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      dni: empleado.dni,
      email: empleado.email,
      cargo: empleado.cargo,
    })
    setErroresForm({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cambiarCampo = (campo) => (evento) => {
    setForm({ ...form, [campo]: evento.target.value })
    setErroresForm({ ...erroresForm, [campo]: '' })
  }

  // Crear / Modificar
  const guardar = async () => {
    const errores = validarFormulario(form)
    if (Object.keys(errores).length > 0) {
      setErroresForm(errores)
      return
    }

    setGuardando(true)
    try {
      if (editandoId === null) {
        await crearEmpleado(form)
        mostrarMensaje('✅ Empleado creado correctamente')
      } else {
        await actualizarEmpleado(editandoId, form)
        mostrarMensaje('✅ Empleado actualizado correctamente')
      }
      limpiarFormulario()
      recargarLista()
    } catch (error) {
      if (error.errores && Object.keys(error.errores).length > 0) {
        // Errores de validación que devolvió el backend (DNI/email duplicado, etc.)
        setErroresForm(error.errores)
      } else {
        mostrarMensaje(`❌ ${error.message}`, 'error')
      }
    } finally {
      setGuardando(false)
    }
  }

  // Consultar
  const verDetalle = async (id) => {
    try {
      setDetalle(await obtenerEmpleado(id))
    } catch (error) {
      mostrarMensaje(`❌ ${error.message}`, 'error')
    }
  }

  // Eliminar
  const confirmarEliminar = async () => {
    try {
      await eliminarEmpleado(aEliminar.id)
      if (editandoId === aEliminar.id) limpiarFormulario()
      mostrarMensaje('✅ Empleado eliminado correctamente')
      recargarLista()
    } catch (error) {
      mostrarMensaje(`❌ ${error.message}`, 'error')
    } finally {
      setAEliminar(null)
    }
  }

  return (
    <Box>
      <TituloSeccion
        titulo="👨‍💼 Gestión de Empleados"
        subtitulo="Agregá o modificá los empleados de la farmacia:"
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
          {editandoId === null ? 'Nuevo empleado' : `Modificando empleado #${editandoId}`}
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
            placeholder="Ej: Ana"
            value={form.nombre}
            onChange={cambiarCampo('nombre')}
            error={erroresForm.nombre}
          />
          <Campo
            etiqueta="Apellido:"
            placeholder="Ej: Gómez"
            value={form.apellido}
            onChange={cambiarCampo('apellido')}
            error={erroresForm.apellido}
          />
          <Campo
            etiqueta="DNI:"
            placeholder="Ej: 30111222"
            value={form.dni}
            onChange={cambiarCampo('dni')}
            error={erroresForm.dni}
          />
          <Campo
            etiqueta="Email:"
            placeholder="Ej: ana.gomez@example.com"
            value={form.email}
            onChange={cambiarCampo('email')}
            error={erroresForm.email}
          />
          <Campo
            etiqueta="Cargo:"
            placeholder="Ej: Farmacéutica"
            value={form.cargo}
            onChange={cambiarCampo('cargo')}
            error={erroresForm.cargo}
          />
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" color="primary" onClick={guardar} disabled={guardando}>
            {guardando
              ? 'Guardando...'
              : editandoId === null
                ? '➕ Agregar empleado'
                : '💾 Guardar cambios'}
          </Button>
          {editandoId !== null && (
            <Button variant="outlined" color="inherit" onClick={limpiarFormulario}>
              Cancelar edición
            </Button>
          )}
        </Stack>
      </Box>

      {/* Listado */}
      <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Listado de empleados</Typography>

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {errorCarga && <Alert severity="error">{errorCarga}</Alert>}

      {!cargando && !errorCarga && empleados.length === 0 && (
        <Alert severity="info">No hay empleados registrados.</Alert>
      )}

      {!cargando && !errorCarga && empleados.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ bgcolor: '#ecf7f2' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Apellido</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>DNI</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cargo</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow key={empleado.id} hover>
                  <TableCell>{empleado.id}</TableCell>
                  <TableCell>{empleado.nombre}</TableCell>
                  <TableCell>{empleado.apellido}</TableCell>
                  <TableCell>{empleado.dni}</TableCell>
                  <TableCell>{empleado.email}</TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={() => verDetalle(empleado.id)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() => iniciarEdicion(empleado)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => setAEliminar(empleado)}
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

      {/* Dialog: consultar */}
      <Dialog open={Boolean(detalle)} onClose={() => setDetalle(null)} fullWidth maxWidth="xs">
        <DialogTitle>Datos del empleado</DialogTitle>
        <DialogContent>
          {detalle && (
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography><b>ID:</b> {detalle.id}</Typography>
              <Typography><b>Nombre:</b> {detalle.nombre}</Typography>
              <Typography><b>Apellido:</b> {detalle.apellido}</Typography>
              <Typography><b>DNI:</b> {detalle.dni}</Typography>
              <Typography><b>Email:</b> {detalle.email}</Typography>
              <Typography><b>Cargo:</b> {detalle.cargo}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalle(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: confirmar eliminación */}
      <Dialog open={Boolean(aEliminar)} onClose={() => setAEliminar(null)}>
        <DialogTitle>Eliminar empleado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que querés eliminar a {aEliminar?.nombre} {aEliminar?.apellido}?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAEliminar(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmarEliminar}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar: mensajes de éxito / error */}
      <Snackbar
        open={mensaje.abierto}
        autoHideDuration={4000}
        onClose={() => setMensaje({ ...mensaje, abierto: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={mensaje.tipo}
          variant="filled"
          onClose={() => setMensaje({ ...mensaje, abierto: false })}
        >
          {mensaje.texto}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default EmpleadosPage
