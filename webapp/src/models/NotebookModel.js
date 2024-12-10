import { CellStatus } from '../components/notebook/content/cell/CellStatus';
import { OutputType } from '../components/notebook/content/cell/result/OutputType';
import { CellExecuteResultType } from "../components/notebook/content/cell/CellExecuteResultType";
import { v4 as uuidv4 } from 'uuid';
import SessionModel from "./SessionModel"
import config from '../config';


class NotebookModel {
  constructor() {
  }

  static getNameWithoutExtension(name = '') {
    if (name.endsWith('.ipynb')) {
      return name.substring(0, name.length - 6);
    } else {
      return name;
    }
  }

  static getNameWithExtension(name = '') {
    if (name.endsWith('.ipynb')) {
      return name;
    } else {
      return name + '.ipynb';
    }
  }

  static async handleWebSocketError(error, baseUrl, notebook, cell, cellStatus, setCellStatus) {
    console.error('WebSocket connection error:', error);
    // Try to recreate the session
    try {
      const newKernelId = await SessionModel.createSession(notebook.path);
      // Try to run the cell again
      const result = await NotebookModel.runCell(baseUrl, cell, newKernelId, cellStatus, setCellStatus);
      return { newKernelId, result };
    } catch (recreateError) {
      console.error('Failed to recreate session:', recreateError);
      throw recreateError;
    }
  };

  static async fetchNotebook(path = '') {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${config.serverBaseUrl}/notebook/` + path, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    return data;
  }

  static async createNotebook(path = '', notebookName = '') {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${config.serverBaseUrl}/notebook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          'name': notebookName,
          'path': path
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create notebook');
    } else {
        const data = await response.json();
        return data;
    }
  }; 

  static async deleteNotebook(path = '') {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${config.serverBaseUrl}/notebook/` + path, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete notebook');
    } else {
        const data = await response.json();
        return data;
    }
  };
  
  static async updateNotebook(path = '', content = {}) {
    const token = sessionStorage.getItem('token');

    const updatedContent = { ...content };
  
    updatedContent.cells = updatedContent.cells.map(cell => {
      const updatedCell = { ...cell };
      return updatedCell;
      });

    // Check if notebook content.metadata has uuid
    if (!updatedContent.metadata.hasOwnProperty('uuid')) {
      updatedContent.metadata.uuid = uuidv4();
    }

    const response = await fetch(`${config.serverBaseUrl}/notebook/` + path, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            'content': updatedContent
        })
    });
  
    if (!response.ok) {
        throw new Error('Failed to update notebook');
    }
    const data = await response.json();
    return data;
  };

  static async renameNotebook(path = '', newName = '') {
    const token = sessionStorage.getItem('token');

    console.log("Renaming notebook at path:", path, "to:", newName);
    
    const response = await fetch(`${config.serverBaseUrl}/notebook/` + path, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            'newName': newName
        })
    });

    if (!response.ok) {
        throw new Error('Failed to rename notebook');
    }
    const data = await response.json();
    return data;
  };

  static async getSparkApps(notebookPath = '') {
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${config.serverBaseUrl}/notebook/spark_app/${notebookPath}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch Spark applications');
        return null;
    }
    const data = await response.json();
    return data;
  };

  static async moveNotebook(path = '', destination = '') {
    console.log("Moving notebook at path:", path, "to:", destination);
    const token = sessionStorage.getItem('token');

    const response = await fetch(`${config.serverBaseUrl}/notebook/` + path, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            'newPath': destination
        })
    });

    if (!response.ok) {
        throw new Error('Failed to move notebook');
    }
    const data = await response.json();
    return data;
  }

  static async runCell(
    basePath, 
    cell, 
    kernelId, 
    cellStatus, 
    setCellStatus) {
    try {
      setCellStatus(CellStatus.WAITING);
      // Create a WebSocket connection to the kernel's channels endpoint
      const wsBasePath = basePath.replace(/^http/, 'ws');
      const socket = new WebSocket(`${wsBasePath}/api/kernels/${kernelId}/channels`);
      
      // Clear the cell's outputs array
      if (cell.outputs) {
          cell.outputs = [];
      }

      // Listen for the error event
      socket.onerror = (error) => {
          console.error('WebSocket connection error:', error);
          NotebookModel.handleWebSocketError(error, basePath, cell, kernelId, cellStatus, setCellStatus);
      };

      // Create a unique msg_id for this execution
      const msg_id = `execute_${Date.now()}`;

      // Wait for the connection to open
      await new Promise((resolve) => {
        socket.onopen = resolve;
      });
  
      // Send an execute_request message
      socket.send(JSON.stringify({
        header: {
          msg_id: msg_id,
          username: '',
          session: '',
          msg_type: 'execute_request',
          version: '5.2',
        },
        parent_header: {},
        metadata: {}, 
        content: {
          code: cell.source,
          silent: false,
          store_history: true,
          user_expressions: {},
          allow_stdin: false,
        },
      }));

      cell.lastExecutionResult = CellExecuteResultType.SUCCESS;
  
      // Wait for the execute_result message
      const result = await new Promise((resolve) => {
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          // Only process messages that are in response to this execution
          if (message.parent_header.msg_id === msg_id) {
              // console.log('Received message:', message);
              cell.lastExecutionTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
              if (message.header.msg_type === OutputType.STATUS) {
                  // Update the cell's status
                  setCellStatus(message.content.execution_state);
                  // If the kernel is idle, resolve the promise
                  if (message.content.execution_state === CellStatus.IDLE) {
                      resolve(cell.outputs);
                  }
              }
              else if (message.header.msg_type === OutputType.STREAM) {
                  // Add the output to the cell's outputs array
                  cell.outputs.push({
                      output_type: OutputType.STREAM,
                      name: message.content.name,
                      text: message.content.text,
                  });
              } else if (message.header.msg_type === OutputType.EXECUTE_RESULT) {
                  // Add the output to the cell's outputs array
                  cell.outputs.push({
                      output_type: OutputType.EXECUTE_RESULT,
                      data: message.content.data,
                      execution_count: message.content.execution_count,
                      metadata: message.content.metadata,
                  });
              } else if (message.header.msg_type === OutputType.ERROR) {
                  cell.lastExecutionResult = CellExecuteResultType.ERROR;
                  // Add the output to the cell's outputs array
                  cell.outputs.push({
                      output_type: OutputType.ERROR,
                      ename: message.content.ename,
                      evalue: message.content.evalue,
                      traceback: message.content.traceback,
                  });
              } else if (message.header.msg_type === OutputType.DISPLAY_DATA) {
                  // Add the output to the cell's outputs array
                  cell.outputs.push({
                      output_type: OutputType.DISPLAY_DATA,
                      data: message.content.data,
                      metadata: message.content.metadata,
                  });
              }
            }
        };
      });
    
      // Close the WebSocket connection
      socket.close();
  
      return result;
    } catch (error) {
      if (error.message.includes('WebSocket connection to')) {
          console.error('Failed to connect to Jupyter kernel:', error);
          // Handle the connection error...
        } else {
          console.error('Error running cell:', error);
          // Handle other errors...
        }
    }
  };

  static async runAllAboveCells(
    index,
    jupyterBaseUrl, 
    notebook, 
    kernelId, 
    setKernelId, 
    cellStatuses, 
    setCellStatus,
    cellExecutedStatuses,
    setCellExecutedStatus
  ) {
    console.log('notebook:', notebook);
    NotebookModel.runAllCells(jupyterBaseUrl, notebook, kernelId, setKernelId, cellStatuses, setCellStatus, cellExecutedStatuses, setCellExecutedStatus, index);
  }

  static async runAllCells(
        jupyterBaseUrl, 
        notebook, 
        kernelId, 
        setKernelId, 
        cellStatuses, 
        setCellStatus,
        cellExecutedStatuses,
        setCellExecutedStatus,
        endCellIndex = notebook.content.cells.length
    ) {
    // Set all cell statuses to 'waiting'
    for (let i = 0; i < endCellIndex; i++) {
        const cell = notebook.content.cells[i];
        if (cell.cell_type === 'code') {
            setCellStatus(i, CellStatus.WAITING);
            cell.outputs = [];
        } else {
            console.log('Skipping cell:', cell);
        }
    }

    for (let i = 0; i < endCellIndex; i++) {
        const cell = notebook.content.cells[i];
        let newKernelId = kernelId;
        console.log('Running cell:', cell);
        if (cell.cell_type === 'code') {
            // If there's no kernel ID, create a new session
            if (!kernelId) {
                setCellStatus(i, CellStatus.INITIALIZING);
                newKernelId = await SessionModel.createSession(notebook.path);
                setKernelId(newKernelId);
            }
            // Call the API to run the cell
            const result = await NotebookModel.runCell(jupyterBaseUrl, cell, newKernelId, cellStatuses[i], (status) => setCellStatus(i, status));
            console.log('Execute result:', result);
        } else {
            // If the cell is a markdown cell, mark it as executed
            setCellExecutedStatus(i, true);
            cell.isExecuted = true;
        }
    }
  };

}

export default NotebookModel;