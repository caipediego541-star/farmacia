import { createTheme } from '@mui/material/styles'
const theme = createTheme({
  palette: {
    primary: { main: '#059669', dark: '#047857', contrastText: '#fff' },
    info: { main: '#2196f3', contrastText: '#fff' },
    warning: { main: '#f59e0b', contrastText: '#fff' },
    background: { default: '#eef3f2' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
})

export default theme
