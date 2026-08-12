import React, { useState } from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Collapse, List, Tooltip, Box } from '@mui/material';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { usePermissions } from '../../../Hooks/usePermissions';
import { useSidebar } from './SidebarContext';
import NAV_ICONS from './navIcons';

const SidebarNavItem = ({ item, depth = 0, onNavigate }) => {
  const { can } = usePermissions();
  const { collapsed, expand } = useSidebar();
  const intl = useIntl();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!can(item.permission)) return null;

  const Icon = item.icon ? NAV_ICONS[item.icon] : null;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isActive = Boolean(item.path) && location.pathname === item.path;
  const label = intl.formatMessage({ id: item.labelId });

  const handleClick = () => {
    if (!hasChildren) return;
    if (collapsed) {
      expand();
      setOpen(true);
      return;
    }
    setOpen((o) => !o);
  };

  const linkProps = hasChildren ? {} : { component: Link, to: item.path };

  const button = (
    <ListItemButton
      {...linkProps}
      onClick={hasChildren ? handleClick : onNavigate}
      selected={isActive}
      sx={{
        mx: 1,
        mb: 0.5,
        borderRadius: 2,
        justifyContent: collapsed ? 'center' : 'flex-start',
        maxHeight: 40,
      }}
    >
      {Icon && (
        <ListItemIcon
          sx={{
            height: 24,
            minWidth: 0,
            mr: collapsed ? 0 : 2,
            justifyContent: 'center',
            color: isActive ? 'primary.main' : 'inherit',
          }}
        >
          <Icon fontSize="small" />
        </ListItemIcon>
      )}
      {!collapsed && <ListItemText primary={label} />}
      {!collapsed &&
        hasChildren &&
        (open ? <ExpandLessRounded fontSize="small" /> : <ExpandMoreRounded fontSize="small" />)}
    </ListItemButton>
  );

  return (
    <>
      {collapsed ? (
        <Tooltip title={label} placement="right">
          <Box>{button}</Box>
        </Tooltip>
      ) : (
        button
      )}

      {hasChildren && !collapsed && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <SidebarNavItem key={child.id} item={child} depth={depth + 1} onNavigate={onNavigate} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SidebarNavItem;
