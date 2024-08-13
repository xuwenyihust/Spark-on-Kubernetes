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

@spark_app_blueprint.route('/spark_app/config', methods=['GET'])
def get_spark_app_config():
    return SparkApp.get_spark_app_config()