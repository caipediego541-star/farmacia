import { useState } from 'react'
import Encabezado from './components/Encabezado.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CategoriasPage from './pages/CategoriasPage.jsx'
import EmpleadosPage from './pages/EmpleadosPage.jsx'
import MedicamentosPage from './pages/MedicamentosPage.jsx'
import { Box, Container, Divider, Paper, Tab, Tabs } from '@mui/material'

function App() {
  const [pestania, setPestania] = useState(0)

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Encabezado />

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Tabs
          value={pestania}
          onChange={(_evento, nuevoValor) => setPestania(nuevoValor)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="📊 Dashboard" />
          <Tab label="💊 Medicamentos" />
          <Tab label="📂 Categorías" />
          <Tab label="👨‍💼 Empleados" />
        </Tabs>
        <Divider />

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {pestania === 0 && <DashboardPage />}

          {pestania === 1 && <MedicamentosPage />}
          

          {pestania === 2 && <CategoriasPage />}
          {pestania === 3 && <EmpleadosPage />}
        </Box>
      </Paper>
    </Container>
  )
}

export default App
