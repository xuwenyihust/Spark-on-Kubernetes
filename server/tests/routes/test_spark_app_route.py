import unittest
import json
from flask_cors import CORS
from flask import g
from database import db
from run import create_app
from app.routes.spark_app import spark_app_blueprint
from app.routes.login import login_blueprint
from app.services.directory import Directory
from app.models.user import UserModel
from app.services.user import User
from app.models.spark_app import SparkAppModel
from app.models.notebook import NotebookModel

class SparkAppRouteTestCase(unittest.TestCase):

  def setUp(self):
    self.app = create_app()
    self.app.register_blueprint(spark_app_blueprint)
    self.app.register_blueprint(login_blueprint)
    self.client = self.app.test_client()
    with self.app.app_context():
      db.create_all()
      user = UserModel(name='test_user', email='test_email')
      user.set_password('test_password')
      db.session.add(user)
      db.session.commit()

  def tearDown(self):
    with self.app.app_context():
      db.session.remove()
      db.drop_all()

  def login_and_get_token(self):
    with self.app.app_context():
      response = self.client.post('/login', auth=('test_user', 'test_password'))
      return json.loads(response.data)['access_token']
    
  def test_create_spark_app(self):
    with self.app.app_context():
      # Create Notebook
      notebook = NotebookModel(name='Test Notebook', path='/path/to/notebook', user_id=1)
      db.session.add(notebook)
      db.session.commit()

      # Create Spark App
      spark_app_id = '1234'
      path = f'/spark-app/${spark_app_id}'

      data = {
        'notebookPath': notebook.path
      }

      token = self.login_and_get_token()
      headers = {
        'Authorization': f'Bearer {token}',
      }

      response = self.client.get(
        path,
        headers=headers,
        data=json.dumps(data),
      )

      print(response.data)
      self.assertEqual(response.status_code, 200)
      self.assertEqual(json.loads(response.data)['spark_app_id'], spark_app_id)
      self.assertEqual(json.loads(response.data)['notebook_id'], notebook.id)
      self.assertEqual(json.loads(response.data)['user_id'], notebook.user_id)
