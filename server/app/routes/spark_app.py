from flask import Blueprint, jsonify, request
from app.services.spark_app import SparkApp
import logging

spark_app_blueprint = Blueprint('spark_app', __name__)

logging.basicConfig(level=logging.INFO)

@spark_app_blueprint.route('/spark_app/<path:spark_app_id>', methods=['POST'])
def create_spark_app(spark_app_id):
    data = request.get_json()
    notebook_path = data.get('notebookPath', None)
    return SparkApp.create_spark_app(spark_app_id=spark_app_id, notebook_path=notebook_path)

@spark_app_blueprint.route('/spark_app/<path:notbook_path>/config', methods=['GET'])
def get_spark_app_config(notbook_path):
    logging.info(f"Getting spark app config for notebook path: {notbook_path}")
    return SparkApp.get_spark_app_config_by_notebook_path(notbook_path)

@spark_app_blueprint.route('/spark_app/<path:notbook_path>/config', methods=['POST'])
def update_spark_app_config(notbook_path):
    logging.info(f"Updating spark app config for notebook path: {notbook_path}")
    data = request.get_json()
    return SparkApp.update_spark_app_config_by_notebook_id(notbook_path, data)