import os
from google.cloud import storage
import subprocess
from pyspark.sql import SparkSession
from IPython import get_ipython
from IPython.display import *
from kubernetes import client, config
import requests
import logging

environment = os.getenv('ENVIRONMENT', 'development')  # Default to 'development' if not set

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Set the environment variables
def set_env():
    # kubernetes_host = os.environ.get('KUBERNETES_SERVICE_HOST')
    # kubernetes_port = os.environ.get('KUBERNETES_SERVICE_PORT')
    # kubernetes_url = f"k8s://https://{kubernetes_host}:{kubernetes_port}"

    # app_name = os.environ.get("APP_NAME", "PySpark Example")
    # driver_host = "notebook-cluster-ip.spark-dev.svc.cluster.local"
    # namespace = os.environ.get("NAMESPACE", "spark-dev")
    # service_account = os.environ.get("SERVICE_ACCOUNT", "spark")
    # executor_image = os.environ.get("EXECUTOR_IMAGE", "wenyixu101/spark:3.5.0-python3.11")

    # app_name = os.environ.get("APP_NAME", "PySpark Example")
    # master_url = os.environ.get("MASTER_URL", "k8s://https://kubernetes.default.svc")

    pass

# Create a Spark session
# def create_spark(app_name, master_url):
    # spark = SparkSession.builder \
    #     .appName(app_name) \
    #     .master(kubernetes_url) \
    #     .config("spark.submit.deployMode", "client") \
    #     .config("spark.driver.host", driver_host) \
    #     .config("spark.driver.cores", "1") \
    #     .config("spark.driver.memory", "1g") \
    #     .config("spark.executor.instances", "1") \
    #     .config("spark.executor.cores", "1") \
    #     .config("spark.executor.memory", "1g") \
    #     .config("spark.kubernetes.namespace", namespace) \
    #     .config("spark.kubernetes.container.image", executor_image) \
    #     .config("spark.kubernetes.authenticate.driver.serviceAccountName", service_account) \
    #     .config("spark.kubernetes.authenticate.executor.serviceAccountName", service_account) \
    #     .config("spark.eventLog.enabled", "true") \
    #     .config("spark.eventLog.dir", f"gs://{bucket_name}/event-logs/") \
    #     .config("spark.history.fs.logDirectory", f"gs://{bucket_name}/event-logs/") \
    #     .config("spark.hadoop.fs.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFileSystem") \
    #     .config("spark.hadoop.fs.AbstractFileSystem.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFS") \
    #     .config("spark.hadoop.fs.gs.auth.service.account.enable", "true") \
    #     .getOrCreate()
    
    # return spark

# def start():
#     # Configuring the API client
#     config.load_incluster_config()

#     # Creating an API instance to interact with the K8s service
#     v1 = client.CoreV1Api()

#     # Fetching the service details
#     service_name = os.environ.get("WEBUI_SERVICE_NAME", "notebook-spark-ui")
#     service = v1.read_namespaced_service(service_name, namespace)

#     webui_host = service.status.load_balancer.ingress[0].ip
#     webui_port = spark.sparkContext.uiWebUrl.split(":")[-1]
#     webui_url = f"http://{webui_host}:{webui_port}"

#     msg = f"**App name**: {app_name}\n\n" + \
#         f"**Master**: {kubernetes_url}\n\n" + \
#         f"**Driver host**: {driver_host}\n\n" + \
#         f"**Spark UI**: {webui_url}"

#     display(Markdown(msg))

class PawMarkSparkSession:

    def __init__(self, spark_session):
        self._spark_session = spark_session
        self.history_server_base_url = "http://localhost:18080"
        try:
            self.config_json = requests.get("http://server:5002/spark_app/config").json()
            self.load_config()
        except Exception as e:
            self.config_json = 'Error loading config: ' + str(e)
    
    def __getattr__(self, name):
        return getattr(self._spark_session, name)
    
    def __repr__(self):
        application_id = self._spark_session.sparkContext.applicationId
        spark_ui_link = self._spark_session.sparkContext.uiWebUrl
        custom_message = f"Custom Spark Session (App ID: {application_id}) - UI: {spark_ui_link}"
        return custom_message

    def _repr_html_(self):
        application_id = self._spark_session.sparkContext.applicationId
        spark_ui_link = f"{self.history_server_base_url}/history/{application_id}"
        return f"""
        <div style="border: 1px solid #e8e8e8; padding: 10px;">
            <h3>Spark Session Information</h3>
            <p><strong>Config:</strong> {self.config_json}</p>
            <p><strong>Application ID:</strong> {application_id}</p>
            <p><strong>Spark UI:</strong> <a href="{spark_ui_link}">{spark_ui_link}</a></p>
        </div>
        """
    
    def load_config(self):
        for key, value in self.config_json.items():
            self._spark_session.conf.set(key, value)

def create_spark_dev():
    logger.info("Creating Spark session")

    spark = PawMarkSparkSession(SparkSession.builder \
        .appName("PySpark Example") \
        .master("spark://spark-master:7077") \
        .config("spark.jars.packages", "io.delta:delta-spark_2.12:3.0.0") \
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
        .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
        .config("spark.eventLog.enabled", "true") \
        .config("spark.eventLog.dir", "/opt/data/spark-events") \
        .config("spark.history.fs.logDirectory", "/opt/data/spark-events") \
        .config("spark.sql.warehouse.dir", "/opt/data/spark-warehouse") \
        # .config("executor.memory", "1g") \
        # .config("executor.cores", "1") \
        # .config("spark.executor.instances", "1") \
        .getOrCreate())
    
    return spark
    
spark = create_spark_dev()