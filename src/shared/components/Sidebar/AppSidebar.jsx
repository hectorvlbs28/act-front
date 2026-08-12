import React from 'react';
import { Box, Drawer, List, Divider, IconButton } from '@mui/material';
import { ChevronLeftRounded, ChevronRightRounded, MenuRounded } from '@mui/icons-material';

import navigationConfig from '../../constants/navigation';
import SidebarNavItem from './SidebarNavItem';
import SidebarUserFooter from './SidebarUserFooter';
import ColorModeIconDropdown from '../ui/ColorModeIconDropdown';
import SitemarkIcon from '../ui/SitemarkIcon';
import { useSidebar, SIDEBAR_WIDTH_EXPANDED } from './SidebarContext';

const SidebarContent = ({ onNavigate }) => {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: 2,
          py: 2,
          minHeight: 64,
        }}
      >
        {!collapsed && <SitemarkIcon size="small" />}
        <IconButton
          size="small"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          {collapsed ? <ChevronRightRounded fontSize="small" /> : <ChevronLeftRounded fontSize="small" />}
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        {navigationConfig.map((item) => (
          <SidebarNavItem key={item.id} item={item} onNavigate={onNavigate} />
        ))}
      </List>

      <Divider />

      <Box
        sx={{
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-start',
          p: 1.5,
        }}
      >
        <ColorModeIconDropdown size="small" />
      </Box>

      <SidebarUserFooter />
    </Box>
  );
};

const AppSidebar = () => {
  const { width, mobileOpen, openMobile, closeMobile } = useSidebar();

  return (
    <>
      <IconButton
        aria-label="Abrir menú"
        onClick={openMobile}
        sx={{
          display: { xs: 'inline-flex', md: 'none' },
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        <MenuRounded />
      </IconButton>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH_EXPANDED, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent onNavigate={closeMobile} />
      </Drawer>
    </>
  );
};

export default AppSidebar;
