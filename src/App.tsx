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

const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { retry: false },
    mutations: { retry: false } 
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.log(`Something went wrong: ${error.message}`)
      enqueueSnackbar(`Something went wrong: ${error.message}`) //TODO fix scope
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.log(`Something went wrong: ${error.message}`)
      enqueueSnackbar(`Something went wrong: ${error.message}`) //TODO fix scope
    }
  })
})

const App = () => {
  return (
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <Header/>
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={`${RoutePath.PRODUCTS}`} element={<ProductsPage />} />
          <Route path={`${RoutePath.ORDERS}`} element={<OrdersPage />} />
          <Route path={'*'} element={<PageNotFound />} />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SnackbarProvider>
  )
}

export default App
