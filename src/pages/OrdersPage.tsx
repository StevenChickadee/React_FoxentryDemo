import { Box, Typography } from "@mui/material"
import OrdersTable from "../components/orders/OrdersTable"

const OrdersPage = () => {
  return (
    <Box
      sx={{
        padding: 2
      }}
    >
      <OrdersTable/>
    </Box>
  )
}

export default OrdersPage