from app.models.notebook import NotebookModel
from flask import jsonify
from datetime import datetime
import requests
import logging
from database import db
import json
from flask import current_app as app

logger = logging.getLogger(__name__)

class Notebook:

  @staticmethod
  def get_all_notebooks():
    notebooks = NotebookModel.query.all()

    # Convert the notebooks to dictionaries
    notebooks_dict = [notebook.to_dict() for notebook in notebooks]

    # Now you can serialize notebooks_dict
    notebooks_json = json.dumps(notebooks_dict)

    return notebooks_json
  
  @staticmethod
  def get_notebook_by_path(notebook_path: str = None):
    logger.info(f"Getting notebook with path: {notebook_path}")

    jupyter_api_path = app.config['JUPYTER_API_PATH']
    logger.info(f"Jupyter API Path: {jupyter_api_path}")

    try:
      path = f"{jupyter_api_path}/{notebook_path}"
      response = requests.get(path)
    except Exception as e:
      return jsonify({'message': 'Error getting notebook from Jupyter Server: ' + str(e)}), 404

    try:
      notebook = NotebookModel.query.filter_by(path=notebook_path).first()
      logger.info(f"Notebook found in DB: {notebook}")
    except Exception as e:
      return jsonify({'message': 'Error getting notebook from DB: ' + str(e)}), 404

    logger.info(f"Response: {response.json()}")
    return response.json()

  @staticmethod
  def create_notebook(notebook_name: str = None, notebook_path: str = None) -> None:
    logger.info(f"Creating notebook with name: {notebook_name} under path: {notebook_path}")

    jupyter_api_path = app.config['JUPYTER_API_PATH']

    path = f"{jupyter_api_path}/{notebook_path}/{notebook_name}"
    data = {
      "type": "notebook",
      "content": {
        "cells": [],
        "metadata": {
          "kernelspec": {
            "name": 'python3',
            "display_name": 'Python 3'
            },
            "language_info": {
                "name": 'python'
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
      }
    }

    try:
      response = requests.put(
        path,
        json=data
      )
    except Exception as e:
      return jsonify({'message': 'Error creating notebook in Jupyter Server: ' + str(e)}), 404

    try:
      notebook = NotebookModel(
        name=notebook_name,
        path=f'{notebook_path}/{notebook_name}'
      )

      db.session.add(notebook)
      db.session.commit()
    except Exception as e:
      return jsonify({'message': 'Error creating notebook in DB: ' + str(e)}), 404

    return response.json()

  @staticmethod
  def create_notebook_with_init_cells(notebook_name: str = None, notebook_path: str = None) -> None:
    logger.info(f"Creating notebook with init cells with name: {notebook_name} under path: {notebook_path}")

    jupyter_api_path = app.config['JUPYTER_API_PATH']
    jupyter_default_path = app.config['JUPYTER_DEFAULT_PATH']

    if not notebook_name or notebook_name == "":
      notebook_name = f"notebook_{datetime.now().strftime('%Y%m%d%H%M%S')}.ipynb"
    if not notebook_path or notebook_path == "":
      notebook_path = jupyter_default_path


    cells = [
      { 
        "cell_type": 'markdown', 
        "metadata": {},
        "source": '# My Notebook' 
      }, { 
        "cell_type": 'code', 
        "execution_count": 1,
        "metadata": {},
        "outputs": [],
        "source": '# SparkSession: spark is already created\nspark' },
    ]

    Notebook.create_notebook(notebook_name, notebook_path)

    path = f"{jupyter_api_path}/{notebook_path}/{notebook_name}"
    data = {
      "type": "notebook",
      "content": {
        "cells": cells,
        "metadata": {
          "kernelspec": {
            "name": 'python3',
            "display_name": 'Python 3'
            },
            "language_info": {
                "name": 'python'
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
      }
    }

    response = requests.put(
      path,
      json=data
    )

    return response.json()

  @staticmethod
  def delete_notebook_by_path(notebook_path: str = None):
    jupyter_api_path = app.config['JUPYTER_API_PATH']

    path = f"{jupyter_api_path}/{notebook_path}"
    response = requests.delete(path)

    if response.status_code != 204:
        return jsonify({'message': 'Notebook not found in jupyter server'}), 404

    try:
      notebook = NotebookModel.query.filter_by(path=notebook_path).first()

      if notebook is None:
          # If no notebook was found with the given path, return a 404 error
          return jsonify({'message': 'Notebook not found in DB'}), 404

      # Delete the notebook
      db.session.delete(notebook)

      # Commit the transaction
      db.session.commit()
    except Exception as e:
      return jsonify({'message': 'Notebook not found in DB'}), 404

    return jsonify({'message': 'Notebook deleted'}), 200
  
  @staticmethod
  def rename_notebook_by_path(notebook_path: str = None, new_notebook_name: str = None):
    jupyter_api_path = app.config['JUPYTER_API_PATH']

    path = f"{jupyter_api_path}/{notebook_path}"
    response = requests.patch(
      path,
      json={"path": f"work/{new_notebook_name}"}
    )

    if response.status_code != 200:
        return jsonify({'message': 'Failed to rename in jupyter server'}), 404

    notebook = NotebookModel.query.filter_by(path=notebook_path).first()

    if notebook is None:
        # If no notebook was found with the given path, return a 404 error
        return jsonify({'message': 'Notebook not found in DB'}), 404

    # Rename the notebook
    notebook.name = new_notebook_name
    notebook.path = f'work/{new_notebook_name}'
    try:
      db.session.commit()
    except Exception as e:
      return jsonify({'message': 'Notebook not found in DB'}), 404

    return jsonify({'message': 'Notebook renamed'}), 200