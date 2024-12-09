import React, { useState, useRef, useEffect } from 'react';
import { Button, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Box } from '@mui/material';
import { CgAdd, CgEye, CgCalendarToday, CgAlbum } from "react-icons/cg";
import { BsPersonCircle } from "react-icons/bs";
import WorkspaceSidebar from './workspace/WorkspaceSidebar'; 
import CreateSidebar from './create/CreateSidebar';
import AccountSidebar from './account/AccountSidebar';
import { ReactComponent as Logo } from '../../assets/logo_#222.svg';

function Sidebar({ 
      onNewNotebookClick, 
      onExistinNotebookClick, 
      onHistoryServerClick,
      onSchedulerClick,
      handleDirectoryClick,
      openWorkspaceDrawer,
      setOpenWorkspaceDrawer,
      currentPath,
      setCurrentPath,
      setRefreshKey,
      workspaceFiles,
      logout,
      rootPath,
      username,
      useremail}) {

    const itemHeight = 35;

    const handleLogoClick = async () => {
      try {
          const response = await fetch('http://localhost:5002/test');
          const data = await response.json();
          console.log(data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };
    
    const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
    const createButtonRef = useRef(null);
    const handleToggleCreateDrawer = () => {
      console.log("Create button Clicked");
      setOpenCreateDrawer(!openCreateDrawer);
    };

    const workspaceButtonRef = useRef(null);
    const handleToggleWorkspaceDrawer = () => {
      console.log("Workspace button Clicked");
      setOpenWorkspaceDrawer(!openWorkspaceDrawer);
    };

    const closeWorkspaceDrawer = () => {
      setOpenWorkspaceDrawer(false);
    }

    const closeCreateDrawer = () => {
      setOpenCreateDrawer(false);
    }

    const [openAccountDrawer, setOpenAccountDrawer] = useState(false);
    const accountButtonRef = useRef(null);
    const handleToggleAccountDrawer = () => {
      setOpenAccountDrawer(!openAccountDrawer);
    }

    return (
      <div style={{ 
          padding: 0}}>
        <Drawer 
          variant="permanent"
          sx={{ 
            transition: 'width 0.3s' }}
          PaperProps={{ 
            style: { 
              width: 200 },
            elevation: 0,
            sx: {
              borderRight: '0.5px solid grey',}
            }}>
            <Toolbar
              style={{ padding: 0 }}> {/* This Toolbar component pushes the content below the AppBar */}
              <Button 
                onClick={handleLogoClick}
                sx={{
                  textTransform: 'none', // Prevents capitalization of the button text
                  color: 'inherit', // Inherits the color from the parent instead of applying button default styles
                  padding: 0 // Removes padding that might affect layout
                }}>
                <Logo style={{ 
                  marginLeft: '0px',
                  marginBottom: '-10px',
                  height: '60px', 
                  width: '120px' }} />
              </Button>
            </Toolbar>

            <Box
              style={{ 
                width: 200,
                height: '100%',
              }}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: '0.5px solid grey',
              }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  fontSize: '12px',
                  mt: 4, 
                  color: 'grey',
                  marginLeft: '22px'
                  }}>
                  OVERVIEW
              </Typography>

              <List 
                sx={{
                  marginLeft: '5px',
                }}>

                {/* Create */}
                <ListItem button ref={createButtonRef} onClick={ () => {
                  handleToggleCreateDrawer()
                  setOpenWorkspaceDrawer(false);
                  setOpenAccountDrawer(false);
                }} 
                  sx={{
                    backgroundColor: openCreateDrawer ? '#555' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#555',
                      },
                      '&:hover .MuiTypography-root': {
                        color: 'white',
                      },
                      height: `${itemHeight}px`
                    }}>
                  <ListItemIcon>
                      <CgAdd style={{ color: openCreateDrawer ? 'white' : 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        sx={{
                          fontFamily: 'Roboto, Arial, sans-serif',
                          fontSize: '14px',  // Adjust size as needed
                          color: 'white', 
                          marginLeft: '-30px' 
                        }}>
                        Create
                      </Typography>
                    }
                  />
                </ListItem>

                {openCreateDrawer && (
                  <CreateSidebar 
                    itemHeight={itemHeight}
                    openCreateDrawer={openCreateDrawer}
                    closeCreateDrawer={closeCreateDrawer}
                    handleToggleCreateDrawer={handleToggleCreateDrawer}
                    createButtonRef={createButtonRef}
                    onNewNotebookClick={onNewNotebookClick}/>
                )}

                {/* Workspace */}
                <ListItem button ref={workspaceButtonRef} onClick={() => {
                  handleToggleWorkspaceDrawer();
                  setOpenCreateDrawer(false);
                  setOpenAccountDrawer(false);
                }} 
                  sx={{
                    backgroundColor: openWorkspaceDrawer ? '#555' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#555'
                    },
                    '&:hover .MuiTypography-root': {
                      color: 'white',
                    },
                    height: `${itemHeight}px`
                  }}>
                  <ListItemIcon>
                      <CgAlbum style={{ color: openWorkspaceDrawer ? 'white' : 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        sx={{
                          fontFamily: 'Roboto, Arial, sans-serif',
                          fontSize: '14px',  // Adjust size as needed
                          color: 'white', 
                          marginLeft: '-30px' 
                        }}>
                        Workspace
                      </Typography>
                    }
                  />
                </ListItem>
                
                { openWorkspaceDrawer && (
                  <WorkspaceSidebar 
                    openWorkspaceDrawer={openWorkspaceDrawer} 
                    closeWorkspaceDrawer={closeWorkspaceDrawer}
                    handleToggleWorkspaceDrawer={handleToggleWorkspaceDrawer}
                    onExistinNotebookClick={onExistinNotebookClick} 
                    handleDirectoryClick={handleDirectoryClick}
                    currentPath={currentPath}
                    setCurrentPath={setCurrentPath}
                    setRefreshKey={setRefreshKey}
                    workspaceFiles={workspaceFiles}
                    rootPath={rootPath}/>
                )}

                {/* History Server */}
                <ListItem button onClick={() => {
                    onHistoryServerClick(); 
                    setOpenWorkspaceDrawer(false); 
                    setOpenAccountDrawer(false);
                    setOpenCreateDrawer(false);}}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#555'
                    },
                    '&:hover .MuiTypography-root': {
                      color: 'white',
                    },
                    height: `${itemHeight}px`
                  }}>
                  <ListItemIcon>
                      <CgEye style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        sx={{
                          fontFamily: 'Roboto, Arial, sans-serif',
                          fontSize: '14px',  // Adjust size as needed
                          color: 'white', 
                          marginLeft: '-30px' 
                        }}>
                        History Server
                      </Typography>
                    }
                  />
                </ListItem>

                {/* Scheduler */}
                <ListItem button onClick={() => {
                    onSchedulerClick();
                    setOpenWorkspaceDrawer(false); 
                    setOpenAccountDrawer(false);
                    setOpenCreateDrawer(false);}
                  }
                  sx={{
                    '&:hover': {
                      backgroundColor: '#555'
                    },
                    '&:hover .MuiTypography-root': {
                      color: 'white',
                    },
                    height: `${itemHeight}px`
                  }}>
                  <ListItemIcon>
                      <CgCalendarToday style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        sx={{
                          fontFamily: 'Roboto, Arial, sans-serif',
                          fontSize: '14px',  // Adjust size as needed
                          color: 'white', 
                          marginLeft: '-30px' 
                        }}>
                        Scheduler
                      </Typography>
                    }
                  />
                </ListItem>
            </List>

            <Box
              ref={accountButtonRef}
              sx={{
                marginTop: 'auto',
                p: 0,
                '&:hover': {
                  backgroundColor: '#555'
                },
                '&:hover .MuiTypography-root': {
                  color: 'white',
                },
                height: `${itemHeight}px`
              }}>
              <Box sx={{
                marginTop: '5px',
                marginLeft: '20px',
                display: 'flex',
                alignItems: 'center',
              }}
                button onClick={() => {
                  handleToggleAccountDrawer();
                }}>
                <BsPersonCircle 
                  size={17}
                  sx={{
                    marginLeft: '100px',
                    color: 'white'
                  }}/>
                <Typography sx={{ 
                  marginLeft: '10px' }}>
                  Account
                </Typography>
              </Box>
            </Box>
          </Box>

          {
            openAccountDrawer && (
              <AccountSidebar 
                itemHeight={itemHeight}
                accountButtonRef={accountButtonRef}
                openAccountDrawer={openAccountDrawer}
                handleToggleAccountDrawer={handleToggleAccountDrawer}
                username={username}
                useremail={useremail}
                logout={logout}
              />
            )
          }

        </Drawer>
      </div>
    );
}

export default Sidebar;

