const API_URL = 'http://localhost:5000'

// Función reutilizable para consultar el backend (GET, POST, PUT, DELETE)
async function consultarAPI(endpoint, opciones = {}) {
  const { body, ...resto } = opciones

  const configuracion = { ...resto }
  if (body !== undefined) {
    configuracion.headers = { 'Content-Type': 'application/json' }
    configuracion.body = JSON.stringify(body)
  }

  const respuesta = await fetch(`${API_URL}${endpoint}`, configuracion)

  let datos = null
  try {
    datos = await respuesta.json()
  } catch {
    datos = null
  }

  if (!respuesta.ok) {
    // Si el backend mandó un mensaje de error, lo usamos
    const error = new Error(
      datos?.error || `Error al consultar la API: ${respuesta.status}`
    )
    error.status = respuesta.status
    error.errores = datos?.errores || {} // errores por campo (validaciones)
    throw error
  }

  return datos
}

// Categorías
export function obtenerCategorias() {
  return consultarAPI('/api/categorias/')
}

// Consultar una categoría por ID
export function obtenerCategoria(id) {
  return consultarAPI(`/api/categorias/${id}`)
}

// Crear una categoría
export function crearCategoria(categoria) {
  return consultarAPI('/api/categorias', {
    method: 'POST',
    body: categoria,
  })
}

// Actualizar una categoría
export function actualizarCategoria(id, categoria) {
  return consultarAPI(`/api/categorias/${id}`, {
    method: 'PUT',
    body: categoria,
  })
}

// Eliminar una categoría
export function eliminarCategoria(id) {
  return consultarAPI(`/api/categorias/${id}`, {
    method: 'DELETE',
  })
}

// Medicamentos

// Listar todos los medicamentos
export function obtenerMedicamentos() {
  return consultarAPI('/api/medicamentos/')
}

// Consultar un medicamento por ID
export function obtenerMedicamento(id) {
  return consultarAPI(`/api/medicamentos/${id}`)
}

// Crear un medicamento
export function crearMedicamento(medicamento) {
  return consultarAPI('/api/medicamentos', {
    method: 'POST',
    body: medicamento,
  })
}

// Actualizar un medicamento
export function actualizarMedicamento(id, medicamento) {
  return consultarAPI(`/api/medicamentos/${id}`, {
    method: 'PUT',
    body: medicamento,
  })
}

// Eliminar un medicamento
export function eliminarMedicamento(id) {
  return consultarAPI(`/api/medicamentos/${id}`, {
    method: 'DELETE',
  })
}

// Empleados
export function obtenerEmpleados() {
  return consultarAPI('/api/empleados')
}

export function obtenerEmpleado(id) {
  return consultarAPI(`/api/empleados/${id}`)
}

export function crearEmpleado(empleado) {
  return consultarAPI('/api/empleados', { method: 'POST', body: empleado })
}

export function actualizarEmpleado(id, empleado) {
  return consultarAPI(`/api/empleados/${id}`, { method: 'PUT', body: empleado })
}

export function eliminarEmpleado(id) {
  return consultarAPI(`/api/empleados/${id}`, { method: 'DELETE' })
}

// Dashboard
export function obtenerResumen() {
  return consultarAPI('/api/dashboard/')
}