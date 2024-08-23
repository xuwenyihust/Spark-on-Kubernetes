from app.models.spark_app import SparkAppModel
from app.models.notebook import NotebookModel
from app.models.spark_app_config import SparkAppConfigModel
from flask import Response
from datetime import datetime
import json
from database import db
from flask import current_app as app
import logging

logger = logging.getLogger(__name__)

class SparkApp:

  @staticmethod
  def get_all_spark_apps():
    spark_apps = SparkAppModel.query.all()

    # Convert the spark apps to dictionaries
    spark_apps_dict = [spark_app.to_dict() for spark_app in spark_apps]

    return Response(
      response=json.dumps(spark_apps_dict),
      status=200
    )
  
  @staticmethod
  def get_spark_app_by_id(spark_app_id: str = None):
    logger.info(f"Getting spark app with id: {spark_app_id}")

    try:
      spark_app = SparkAppModel.query.filter_by(spark_app_id=spark_app_id).first()
      logger.info(f"Spark app found in DB: {spark_app}")
    except Exception as e:
      return Response(
        response=json.dumps({'message': 'Error getting spark app from DB: ' + str(e)}), 
        status=404)

    return Response(
      response=json.dumps(spark_app.to_dict()), 
      status=200
    )
  
  @staticmethod
  def get_spark_app_config_by_notebook_path(notbook_path: str = None):
    # Get notebook id from path
    notebook = NotebookModel.query.filter_by(path=notbook_path).first()
    notebook_id = notebook.id

    # Get the spark app config
    spark_app_config = SparkAppConfigModel.query.filter_by(notebook_id=notebook_id).first()

    if (spark_app_config is not None):
      spark_app_config_dict = spark_app_config.to_dict()
      spark_app_config_dict_transformed = {
        'spark.driver.memory': spark_app_config_dict['driver_memory'],
        'spark.driver.memoryOverhead': spark_app_config_dict['driver_memory_overhead'],
        'spark.driver.cores': spark_app_config_dict['driver_cores'],
        'spark.executor.memory': spark_app_config_dict['executor_memory'],
        'spark.executor.memoryOverhead': spark_app_config_dict['executor_memory_overhead'],
        'spark.executor.memoryFraction': spark_app_config_dict['executor_memory_fraction'],
        'spark.executor.cores': spark_app_config_dict['executor_cores'],
        'spark.executor.instances': spark_app_config_dict['executor_instances'],
        'spark.dynamicAllocation.enabled': spark_app_config_dict['dynamic_allocation_enabled'],
        'spark.dynamicAllocation.minExecutors': spark_app_config_dict['executor_instances_min'],
        'spark.dynamicAllocation.maxExecutors': spark_app_config_dict['executor_instances_max'],
        'spark.shuffle.service.enabled': spark_app_config_dict['shuffle_service_enabled'],
        'spark.executor.idleTimeout': spark_app_config_dict['executor_idle_timeout'],
        'spark.queue': spark_app_config_dict['queue']
      }

      return Response(
        response=json.dumps(spark_app_config_dict_transformed), 
        status=200
      )
    else:
      # Default spark app config
      spark_app_config = {
        'spark.driver.memory': '1g',
        'spark.driver.cores': 1,
        'spark.executor.memory': '1g',
        'spark.executor.cores': 1,
        'spark.executor.instances': 1,
        'spark.dynamicAllocation.enabled': False,
      }

      return Response(
        response=json.dumps(spark_app_config),
        status=200
      )
  
  @staticmethod
  def update_spark_app_config_by_notebook_path(notebook_path: str = None, data: dict = None):
    logger.info(f"Updating spark app config for notebook path: {notebook_path} with data: {data}")

    if notebook_path is None:
      logger.error("Notebook path is None")
      return Response(
        response=json.dumps({'message': 'Notebook path is None'}), 
        status=404)
    
    # Get the notebook id
    notebook = NotebookModel.query.filter_by(path=notebook_path).first()
    if notebook is None:
      logger.error("Notebook not found")
      return Response(
        response=json.dumps({'message': 'Notebook not found'}), 
        status=404)

    notebook_id = notebook.id

    # Transform data
    transformed_data = {
      'driver_memory': data.get('spark.driver.memory', None),
      'driver_memory_overhead': data.get('spark.driver.memoryOverhead', None),
      'driver_cores': data.get('spark.driver.cores', None),
      'executor_memory': data.get('spark.executor.memory', None),
      'executor_memory_overhead': data.get('spark.executor.memoryOverhead', None),
      'executor_memory_fraction': data.get('spark.executor.memoryFraction', None),
      'executor_cores': data.get('spark.executor.cores', None),
      'executor_instances': data.get('spark.executor.instances', None),
      'dynamic_allocation_enabled': data.get('spark.dynamicAllocation.enabled', None),
      'executor_instances_min': data.get('spark.dynamicAllocation.minExecutors', None),
      'executor_instances_max': data.get('spark.dynamicAllocation.maxExecutors', None),
      'shuffle_service_enabled': data.get('spark.shuffle.service.enabled', None),
      'executor_idle_timeout': data.get('spark.executor.idleTimeout', None),
      'queue': data.get('spark.queue', None)
    }

    config = SparkAppConfigModel.query.filter_by(notebook_id=notebook_id).first()
    if config is None:
      config = SparkAppConfigModel(notebook_id=notebook_id, **transformed_data)
      db.session.add(config)
    else:
      for key, value in transformed_data.items():
        setattr(config, key, value)

    db.session.commit()
    db.session.refresh(config)
    
    return Response(
      response=json.dumps({'message': 'Updated spark app config'}), 
      status=200)
  
  @staticmethod
  def create_spark_app(spark_app_id: str = None, notebook_path: str = None):
    logger.info(f"Creating spark app with id: {spark_app_id} for notebook path: {notebook_path}")

    if spark_app_id is None:
      logger.error("Spark app id is None")
      return Response(
        response=json.dumps({'message': 'Spark app id is None'}), 
        status=404)

    if notebook_path is None:
      logger.error("Notebook path is None")
      return Response(
        response=json.dumps({'message': 'Notebook path is None'}), 
        status=404)

    try:
      # Get the notebook id
      notebook = NotebookModel.query.filter_by(path=notebook_path).first()
      notebook_id = notebook.id

      # Create the spark app
      spark_app = SparkAppModel(
        spark_app_id=spark_app_id,
        notebook_id=notebook_id,
        user_id=notebook.user_id,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
      )

      db.session.add(spark_app)
      db.session.commit()

      logger.info(f"Spark app created: {spark_app}")
    except Exception as e:
      logger.error(f"Error creating spark app: {e}")
      return Response(
        response=json.dumps({'message': 'Error creating spark app: ' + str(e)}), 
        status=404)

    return Response(
      response=json.dumps(spark_app.to_dict()), 
      status=200
    )