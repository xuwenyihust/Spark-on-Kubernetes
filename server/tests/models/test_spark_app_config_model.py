import unittest
from flask_cors import CORS
from run import create_app
from database import db
from app.models.spark_app_config import SparkAppConfigModel
from app.models.notebook import NotebookModel
from app.models.user import UserModel

class SparkAppConfigModelTestCase(unittest.TestCase):

  def setUp(self):
    self.app = create_app()
    self.client = self.app.test_client()
    with self.app.app_context():
      db.create_all()

  def tearDown(self):
    with self.app.app_context():
      db.session.remove()
      db.drop_all()

  def test_spark_app_config_model(self):
    with self.app.app_context():
      # Create user
      user = UserModel(name='testuser', email='testuser@example.com')
      password = 'test_password'
      user.set_password(password)
      db.session.add(user)
      db.session.commit()

      self.assertEqual(user.id, 1)

      # Create notebook
      notebook = NotebookModel(name = 'test_notebook', path='test_notebook', user_id=1)
      db.session.add(notebook)
      db.session.commit()

      self.assertEqual(notebook.id, 1)

      # Create spark app config
      spark_app_config = SparkAppConfigModel(
        notebook_id=1,
        driver_memory='1g',
        driver_memory_overhead='1g',
        driver_cores=1,
        executor_memory='1g',
        executor_memory_overhead='1g',
        executor_memory_fraction=1.0,
        executor_cores=1,
        executor_instances=1,
        dynamic_allocation_enabled=True,
        executor_instances_min=1,
        executor_instances_max=1,
        shuffle_service_enabled=True,
        executor_idle_timeout=1,
        queue='test_queue'
      )
      db.session.add(spark_app_config)
      db.session.commit()

      spark_app_config_dict = spark_app_config.to_dict()
      self.assertEqual(spark_app_config_dict['notebook_id'], 1)
      self.assertEqual(spark_app_config_dict['driver_memory'], '1g')
      self.assertEqual(spark_app_config_dict['driver_memory_overhead'], '1g')
      self.assertEqual(spark_app_config_dict['driver_cores'], 1)
      self.assertEqual(spark_app_config_dict['executor_memory'], '1g')
      self.assertEqual(spark_app_config_dict['executor_memory_overhead'], '1g')
      self.assertEqual(spark_app_config_dict['executor_memory_fraction'], 1.0)
      self.assertEqual(spark_app_config_dict['executor_cores'], 1)
      self.assertEqual(spark_app_config_dict['executor_instances'], 1)
      self.assertEqual(spark_app_config_dict['dynamic_allocation_enabled'], True)
      self.assertEqual(spark_app_config_dict['executor_instances_min'], 1)
      self.assertEqual(spark_app_config_dict['executor_instances_max'], 1)
      self.assertEqual(spark_app_config_dict['shuffle_service_enabled'], True)
      self.assertEqual(spark_app_config_dict['executor_idle_timeout'], 1)
      self.assertEqual(spark_app_config_dict['queue'], 'test_queue')