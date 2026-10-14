const API_URL = 'http://localhost:5000'

// Función reutilizable para consultar el backend
async function consultarAPI(endpoint) {
  const respuesta = await fetch(`${API_URL}${endpoint}`)

  if (!respuesta.ok) {
    throw new Error(`Error al consultar la API: ${respuesta.status}`)
  }

  return await respuesta.json()
}

// Categorías
export function obtenerCategorias() {
  return consultarAPI('/api/categorias/')
}

// Medicamentos
export function obtenerMedicamentos() {
  return consultarAPI('/api/medicamentos/')
}

// Empleados
export function obtenerEmpleados() {
  return consultarAPI('/api/empleados/')
}

// Dashboard
export function obtenerResumen() {
  return consultarAPI('/api/dashboard/')
}