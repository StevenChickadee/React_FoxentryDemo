import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteSingleProduct, loadProducts } from "../../lib/products-lib"
import { QueryKey, RoutePath } from "../../lib/common-lib"
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid"
import { Product, ProductItems, ProductParams } from "../../lib/products-types"
import { IconButton, Stack, TextField, Typography } from "@mui/material"
import { Add, Delete, Edit } from "@mui/icons-material"
import { AxiosError } from "axios"
import { useCallback, useState } from "react"
import ProductDialog from "./ProductDialog"

const ProductsTable = () => {

  const [isProductDialogOpen, setIsProductDialogOpen] = useState<boolean>(false)
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined)
  const [params, setParams] = useState<ProductParams>({})

  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [QueryKey.PRODUCTS, params],
    queryFn: () => loadProducts(params)
  })

  const deleteProduct = useMutation<void, AxiosError, string>({
    mutationFn: deleteSingleProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QueryKey.PRODUCTS]})
    }
  })

  const columns: GridColDef<Product>[] = [
    {
      field: ProductItems.name,
      headerName: 'name',
      flex: 1,
    },
    {
      field: ProductItems.price,
      headerName: 'price',
      type: 'number',
      flex: 1,
    },
    {
      field: ProductItems.availability,
      headerName: 'availability',
      type: 'number',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams) => 
        <Stack direction={'row'} spacing={1}>
          <IconButton
            onClick={() => deleteProduct.mutate(row.id)}
          >
            <Delete />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedProductId(row.id)
              setIsProductDialogOpen(true)
            }}
          >
            <Edit />
          </IconButton>
        </Stack>
    },
  ];

  const handleProductDialogClose = useCallback(() => {
    setIsProductDialogOpen(false)
    setSelectedProductId(undefined)
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
        <Typography>
          {'ProductsTable'}
        </Typography>
        <Stack 
          direction={'row'} 
          justifyContent={'space-between'}
          spacing={1}
        >
          <TextField
            name={'productSearch'}
            label={'productSearch'}
            value={params.search ?? ''}
            onChange={handleSearchChange} //TODO debounce
          />
          <IconButton
            onClick={() => {
              setIsProductDialogOpen(true)
            }}
          >
            <Add />
          </IconButton>
        </Stack>
        <DataGrid
          rows={products ?? [] as Product[]}
          columns={columns}
          loading={isLoading}
          getRowId={ ( row: Product ) => row.id }
          disableColumnMenu
          hideFooter
        />
      </Stack>
      {isProductDialogOpen ? 
        <ProductDialog
          handleProductDialogClose={handleProductDialogClose}
          productId={selectedProductId}
        />
        :
        null
      }
    </>
  )
}
  
export default ProductsTable