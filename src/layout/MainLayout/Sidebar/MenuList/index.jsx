import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

// project imports
import NavGroup from './NavGroup'
import { menuItems } from '@/menu-items'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({ drawerOpen }) => {
    const navItems = menuItems.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} drawerOpen={drawerOpen} />
            default:
                return (
                    <Typography key={item.id} variant='h6' color='error' align='center'>
                        خطا در موارد منو
                    </Typography>
                )
        }
    })

    return <Box>{navItems}</Box>
}

MenuList.propTypes = {
    drawerOpen: PropTypes.bool
}

export default MenuList
