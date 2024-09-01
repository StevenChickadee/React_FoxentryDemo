import { Route, Routes } from "react-router-dom"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./pages/Home"
import PageNotFound from "./pages/PageNotFound"
import OrdersPage from "./pages/OrdersPage"
import ProductsPage from "./pages/ProductsPage"
import Header from "./components/common/Header"
import { RoutePath } from "./lib/common-lib"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { enqueueSnackbar, SnackbarProvider } from "notistack"
import { Box, Container, createTheme, ThemeProvider } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: {
      main: '#E74600',
    },
    secondary: {
      main: '#6835D1',
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { retry: false },
    mutations: { retry: false } 
  },
  queryCache: new QueryCache({
    onError: (error) => {
      enqueueSnackbar(`Something went wrong: ${error.message}`)
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      enqueueSnackbar(`Something went wrong: ${error.message}`)
    }
  })
})

const App = () => {
  return (
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Box 
            sx={{
              height: '100vh',
              width: '100%',
              bgcolor: "#FFFFFF"
            }}
          >
            <Header/>
            <Routes>
              <Route path={'/'} element={<Home />} />
              <Route path={`${RoutePath.PRODUCTS}`} element={<ProductsPage />} />
              <Route path={`${RoutePath.ORDERS}`} element={<OrdersPage />} />
              <Route path={'*'} element={<PageNotFound />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  )
}

export default App
