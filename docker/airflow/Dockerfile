FROM apache/airflow:2.9.1-python3.11

USER root

# Install OpenJDK 17
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    rm -rf /var/lib/apt/lists/*

USER airflow

RUN pip install --upgrade pip && \
    pip install apache-airflow-providers-papermill ipython jupyter ipykernel papermill pandas numpy matplotlib seaborn pyspark==3.5.0

# Add and install the Python 3 kernel
RUN python3 -m ipykernel install --user --name python3 --display-name "Python 3"

# Set JAVA_HOME environment variable
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64

COPY webserver_config.py /opt/airflow/webserver_config.py
COPY airflow.cfg /opt/airflow/airflow.cfg

