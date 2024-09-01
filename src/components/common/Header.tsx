import { Stack } from "@mui/material"
import { Link } from "react-router-dom"
import { RoutePath } from "../../lib/common-lib"

const Header = () => {
    return (
      <Stack direction='row' spacing={1}>
        <Link to={`${RoutePath.ORDERS}`}>{'orders'}</Link>
        <Link to={`${RoutePath.PRODUCTS}`}>{'products'}</Link>
      </Stack>
    )
  }
  
  export default Header