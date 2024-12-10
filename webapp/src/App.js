import React, { useState, useEffect, useRef } from 'react';
import LoginForm from './components/auth/LoginForm';
import Sidebar from './components/sidebar/Sidebar';
import Notebook from './components/notebook/Notebook';
import HistoryServer from './components/HistoryServer';
import Scheduler from './components/Scheduler';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import config from './config';
import NotebookModel from './models/NotebookModel';
import DirectoryModel from './models/DirectoryModel';
import SparkModel from './models/SparkModel';

const theme = createTheme({
  components: {
      MuiDrawer: {
          styleOverrides: {
              paper: {
                  backgroundColor: '#222', // Dark background color
                  color: '#fff', // White text color
                  width: '200px',
                  justifyContent: 'left',
                  fontFamily: 'Roboto, Arial, sans-serif',
              },
          },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'Roboto, Arial, sans-serif',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            position: 'sticky',
            top: 0,
          },
        },
      },
  },
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  
  const [showHistoryServer, setShowHistoryServer] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  const [showNotebook, setShowNotebook] = useState(false);
  const [notebook, setNotebook] = useState({});
  const [notebookState, setNotebookState] = useState({}); 
  const [isNotebookModified, setIsNotebookModified] = useState(false);

  const [openWorkspaceDrawer, setOpenWorkspaceDrawer] = useState(false);
  const [currentPath, setCurrentPath] = useState('work');
  const [rootPath, setRootPath] = useState('work');
  const [workspaceFiles, setWorkspaceFiles] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const notebookRef = useRef(null);

  // Auth
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUseremail = localStorage.getItem('useremail');
    if (storedUsername && storedUseremail) {
      setUsername(storedUsername);
      setUseremail(storedUseremail);
      setCurrentPath(`work/${storedUseremail}`);
      setRootPath(`work/${storedUseremail}`);
      setIsLoggedIn(true);
      console.log('Logged in as:', storedUsername, storedUseremail);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    setUsername('');
    setUseremail('');
    setIsLoggedIn(false);
  }

  // Workspace
  useEffect(() => {
    if (openWorkspaceDrawer) {
        DirectoryModel.getChildren(currentPath) // Fetch files from the root or specify a path
            .then(setWorkspaceFiles)
            .catch(error => console.error('Failed to fetch files:', error));
        console.log('Fetched workspace files:', workspaceFiles);
    }
  }, [openWorkspaceDrawer, currentPath, notebookState, refreshKey]);

  const handleDirectoryClick = (path) => {
    setCurrentPath(path);  // Update the path to fetch and display new contents
  };

  // Notebook
  const handleUnsavedChanges = () => {
    if (isNotebookModified) {
      const confirmSwitch = window.confirm('You have unsaved changes. Are you sure you want to switch notebooks?');
      if (confirmSwitch) {
        setIsNotebookModified(false);
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  const handleNewNotebookClick = () => {
    if (handleUnsavedChanges()) {
      NotebookModel.createNotebook('', '').then((data) => {
        const notebookPath = `${data.path}`
        NotebookModel.fetchNotebook(notebookPath).then((data) => {
          setNotebook(data);
          setShowHistoryServer(false);
          setShowScheduler(false);
          setShowNotebook(true);
        }).catch((error) => {
          console.error('Failed to fetch newly created notebook:', error);
        });
        
      }).catch((error) => {
        console.error('Failed to create notebook:', error);
      });
    }
  };  

  const handleExistingNotebookClick = async (path) => {
    if (handleUnsavedChanges()) {
        try {
            const [notebookData, sparkApp] = await Promise.all([
                NotebookModel.fetchNotebook(`${path}`),
                SparkModel.getSparkAppByNotebookPath(path)
            ]);

            if (notebookData.message === 'Token has expired') {
                console.error('Token has expired, please log in again');
                logout();
                return;
            }

            console.log('Fetched notebook:', notebookData);
            setNotebook(notebookData);
            
            // Update Spark badge if there's an active Spark app
            if (sparkApp && sparkApp.spark_app_id) {
                notebookRef.current?.setSparkAppId(sparkApp.spark_app_id);
            }

            setShowHistoryServer(false);
            setShowScheduler(false);
            setShowNotebook(true);
        } catch (error) {
            console.error('Failed to fetch notebook or Spark app:', error);
        }
    }
  }

  const handleDeleteNotebook = () => {
    if (window.confirm('Are you sure you want to delete this notebook?')) {
      NotebookModel.deleteNotebook(notebookState.path).then((data) => {
        setNotebookState({}); // Clear notebook content
        console.log('Notebook deleted:', notebookState);
    }).catch((error) => {
        console.error('Failed to delete notebook:', error);
    });
  }}

  // History server
  const handleHistoryServerClick = () => {
    console.log('config.sparkUiBaseUrl:', config.sparkUiBaseUrl);
    if (handleUnsavedChanges()) {
      setShowNotebook(false);
      setShowScheduler(false);
      setShowHistoryServer(true);
    }
  };

  // Scheduler
  const handleSchedulerClick = () => {
    console.log(config.airflowBaseUrl)
    console.log('Scheduler clicked');
    if (handleUnsavedChanges()) {
      setShowNotebook(false);
      setShowHistoryServer(false);
      setShowScheduler(true);
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={(username, useremail) => {
      setUsername(username);
      setUseremail(useremail);
      setCurrentPath(`work/${useremail}`);
      setRootPath(`work/${useremail}`);
      setIsLoggedIn(true);
      console.log('Logged in as:', username, useremail);

      // Store username and useremail in local storage
      localStorage.setItem('username', username);
      localStorage.setItem('useremail', useremail);
    }} />;
  } else {
    return (
        <ThemeProvider theme={theme}>
          <Sidebar 
            onNewNotebookClick={handleNewNotebookClick} 
            onExistinNotebookClick={handleExistingNotebookClick}
            onHistoryServerClick={handleHistoryServerClick} 
            onSchedulerClick={handleSchedulerClick}
            handleDirectoryClick={handleDirectoryClick}
            openWorkspaceDrawer={openWorkspaceDrawer}
            setOpenWorkspaceDrawer={setOpenWorkspaceDrawer}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            setRefreshKey={setRefreshKey}
            workspaceFiles={workspaceFiles}
            logout={logout} 
            rootPath={rootPath}
            username={username}
            useremail={useremail}/>
          <Notebook 
            ref={notebookRef}
            showNotebook={showNotebook}
            notebook={notebook}
            notebookState={notebookState}
            setNotebookState={setNotebookState}
            isNotebookModified={isNotebookModified}
            setIsNotebookModified={setIsNotebookModified}
            handleDeleteNotebook={handleDeleteNotebook} />
          <HistoryServer showHistoryServer={showHistoryServer} />
          <Scheduler showScheduler={showScheduler} />
        </ThemeProvider>
    );
  }
};

export default App;
