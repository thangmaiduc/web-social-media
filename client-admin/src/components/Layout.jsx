import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ImageIcon from '@mui/icons-material/Image';
import MenuIcon from '@mui/icons-material/Menu';
import  { ToastContainer } from '../utility/toast';
import { ExitToApp } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import userSlice from '../redux/slices/userSlice';
const drawerWidth = 240;
function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [logout2, setLogout] = React.useState(false);
  const dispatch = useDispatch()
  const logout = () => {
   dispatch(userSlice.actions.logout());

  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <Link
            to={`/admin/dashboard`}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={'Dashboard'} />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Link
            to={`/admin/users`}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={'User'} />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Link
            to={`/admin/posts`}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <ListItemButton>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary={'Post'} />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding onClick={logout}>
          <Link
            to={`/`}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <ListItemButton>
              <ListItemIcon  >
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary={'Đăng xuất'} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <Divider />
     
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Quản Lí Social Media
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='mailbox folders'
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
      <ToastContainer/>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
