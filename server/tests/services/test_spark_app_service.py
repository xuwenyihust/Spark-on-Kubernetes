import unittest
from flask_cors import CORS
from flask import g
from run import create_app
from database import db
from app.models.spark_app import SparkAppModel
from app.models.notebook import NotebookModel
from app.models.user import UserModel
from app.services.notebook import Notebook
from app.services.spark_app import SparkApp
import datetime
import json

class SparkAppServiceTestCase(unittest.TestCase):

  def setUp(self):
    self.app = create_app()
    self.client = self.app.test_client()
    with self.app.app_context():
      db.create_all()

  def tearDown(self):
    with self.app.app_context():
      db.session.remove()
      db.drop_all()

  def test_get_spark_by_id(self):
    with self.app.app_context():
      # Create User
      user_0 = UserModel(name='testuser0', email='testuser0@example.com')
      password = 'test_password'
      user_0.set_password(password)
      db.session.add(user_0)
      db.session.commit()
      g.user = user_0

      # Create notebook
      notebook_0 = NotebookModel(name='Test Notebook', path='/path/to/notebook', user_id=user_0.id)
      db.session.add(notebook_0)
      db.session.commit()

      # Create spark app
      spark_app_0 = SparkAppModel(spark_app_id='1234', notebook_id=notebook_0.id, user_id=user_0.id, created_at=datetime.datetime.now())
      db.session.add(spark_app_0)

      # Get spark app by id
      response = SparkApp.get_spark_app_by_id(spark_app_id='1234')
      spark_app_dict = json.loads(response.data)
      self.assertEqual(spark_app_dict['spark_app_id'], '1234')

  def test_get_spark_app_config_by_notebook_path(self):
    with self.app.app_context():
      # Create User
      user_0 = UserModel(name='testuser0', email='testuser0@example.com')
      password = 'test_password'
      user_0.set_password(password)
      db.session.add(user_0)
      db.session.commit()
      g.user = user_0

      # Create notebook
      notebook_0 = NotebookModel(name='Test Notebook', path='/path/to/notebook', user_id=user_0.id)
      db.session.add(notebook_0)
      db.session.commit()

      # Get spark app config by notebook path
      response = SparkApp.get_spark_app_config_by_notebook_path('/path/to/notebook')
      spark_app_config_dict = json.loads(response.data)

      self.assertEqual(spark_app_config_dict['spark.driver.memory'], '1g')

  def test_update_spark_app_config(self):
    with self.app.app_context():
      # Create User
      user_0 = UserModel(name='testuser0', email='testuser0@example.com')
      password = 'test_password'
      user_0.set_password(password)
      db.session.add(user_0)
      db.session.commit()
      g.user = user_0

      # Create notebook
      notebook_0 = NotebookModel(name='Test Notebook', path='/path/to/notebook', user_id=user_0.id)
      db.session.add(notebook_0)
      db.session.commit()

      # Update spark app config



  def test_create_spark_app(self):
    with self.app.app_context():
      user_0 = UserModel(name='testuser0', email='testuser0@example.com')
      password = 'test_password'
      user_0.set_password(password)
      db.session.add(user_0)
      db.session.commit()
      g.user = user_0

      # Create notebook
      response_0 = Notebook.create_notebook_with_init_cells(notebook_name='Test Notebook', notebook_path='')
      notebook_dict = json.loads(response_0.data.decode('utf8'))
      notebook_path = notebook_dict['path']

      # Create spark app
      response_1 = SparkApp.create_spark_app(spark_app_id='1234', notebook_path=notebook_path)
      spark_app_dict = json.loads(response_1.data)
      self.assertEqual(spark_app_dict['spark_app_id'], '1234')

      # Check that spark app is in the database
      spark_app = SparkAppModel.query.filter_by(spark_app_id='1234').first()
      self.assertIsNotNone(spark_app)


