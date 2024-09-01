import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { loadOrders } from "../../lib/orders-lib"
import { QueryKey, RoutePath } from "../../lib/common-lib"
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid"
import { Order, OrderItems, OrderParams } from "../../lib/orders-types"
import { Button, IconButton, Stack, TextField, Typography } from "@mui/material"
import { Add, Delete, Edit } from "@mui/icons-material"
import { AxiosError } from "axios"
import { useCallback, useState } from "react"
import OrderDialog from "./OrderDialog"

const OrdersTable = () => {

  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState<boolean>(false)
  const [params, setParams] = useState<OrderParams>({})

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: [QueryKey.ORDERS, params],
    queryFn: () => loadOrders(params)
  })

  const columns: GridColDef<Order>[] = [
    {
      field: OrderItems.customer_name,
      headerName: 'customer_name',
      flex: 1,
    },
    {
      field: OrderItems.product_name,
      headerName: 'product_name',
      flex: 1,
    },
    {
      field: OrderItems.amount,
      headerName: 'amount',
      type: 'number',
      flex: 1,
    },
    {
      field: OrderItems.price_per_item,
      headerName: 'price_per_item',
      type: 'number',
      flex: 1,
    },
    {
      field: OrderItems.date_created,
      headerName: 'date_created',
      flex: 1,
    }
  ];

  const handleOrderDialogClose = useCallback(() => {
    setIsOrderDialogOpen(false)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setParams(value.length ? { search: value } : { })
  }, [])

  return (
    <>
      <Stack 
        direction={'column'}
        spacing={1}
      >
        <Typography 
          variant={'h6'}
          color={'primary'}
        >
          {'OrdersTable'}
        </Typography>
        <Stack 
          direction={'row'} 
          justifyContent={'space-between'}
          spacing={1}
        >
          <TextField
            name={'orderSearch'}
            label={'orderSearch'}
            value={params.search ?? ''}
            onChange={handleSearchChange} //TODO debounce
          />
          <Button
            variant={'contained'}
            startIcon={<Add />}
            onClick={() => {
              setIsOrderDialogOpen(true)
            }}
          >
            {'NEW ORDER'}
          </Button>
        </Stack>
        <DataGrid
          rows={orders ?? [] as Order[]}
          columns={columns}
          loading={isLoading}
          getRowId={ ( row: Order ) => row.id }
          disableColumnMenu
          hideFooter
        />
      </Stack>
      {isOrderDialogOpen ? 
        <OrderDialog
          handleOrderDialogClose={handleOrderDialogClose}
        />
        :
        null
      }
    </>
  )
}
  
export default OrdersTable