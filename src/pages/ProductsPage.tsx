import { Box, Typography } from "@mui/material"
import ProductsTable from "../components/products/ProductsTable"

const ProductsPage = () => {
  return (
    <Box
      sx={{
        padding: 2
      }}
    >
      <ProductsTable/>
    </Box>
  )
}

export default ProductsPage