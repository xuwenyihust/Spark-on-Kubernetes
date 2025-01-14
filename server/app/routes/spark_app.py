from flask import Blueprint, jsonify, request
from app.services.spark_app import SparkApp
from flask_jwt_extended import jwt_required
from app.auth.auth import identify_user
import logging

spark_app_blueprint = Blueprint('spark_app', __name__)

logging.basicConfig(level=logging.INFO)

@spark_app_blueprint.route('/spark_app/<path:notbook_path>/config', methods=['GET'])
def get_spark_app_config(notbook_path):
    logging.info(f"Getting spark app config for notebook path: {notbook_path}")
    return SparkApp.get_spark_app_config_by_notebook_path(notbook_path)

@spark_app_blueprint.route('/spark_app/<path:notbook_path>/config', methods=['POST'])
def update_spark_app_config(notbook_path):
    logging.info(f"Updating spark app config for notebook path: {notbook_path}")
    data = request.get_json()
    return SparkApp.update_spark_app_config_by_notebook_path(notbook_path, data)

@spark_app_blueprint.route('/spark_app/<spark_app_id>/status', methods=['GET'])
def get_spark_app_status(spark_app_id):
    logging.info(f"Getting spark app status for app id: {spark_app_id}")
    return SparkApp.get_spark_app_status(spark_app_id)

@spark_app_blueprint.route('/spark_app/<spark_app_id>', methods=['POST'])
@jwt_required()
@identify_user
def create_spark_app(spark_app_id):
    logging.info(f"Creating spark app with id: {spark_app_id}")
    data = request.get_json()
    notebook_path = data.get('notebookPath')
    return SparkApp.create_spark_app(spark_app_id=spark_app_id, notebook_path=notebook_path)