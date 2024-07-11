import unittest
from flask_cors import CORS
from run import create_app
from database import db
from app.models.spark_app import SparkAppModel

class SparkAppModelTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_spark_app_model(self):
        with self.app.app_context():
            spark_app = SparkAppModel(spark_app_id='Test Spark App')
            db.session.add(spark_app)
            db.session.commit()

            self.assertEqual(spark_app.spark_app_id, 'Test Spark App')

            spark_app_dict = spark_app.to_dict()
            self.assertEqual(spark_app_dict, {
                'spark_app_id': 'Test Spark App'
            })