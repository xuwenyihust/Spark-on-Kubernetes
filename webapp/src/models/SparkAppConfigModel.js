import config from '../config';

class SparkAppConfigModel {
  constructor() {
  }

  static async getSparkAppConfigByNotebookPath(notebookPath) {
    const response = await fetch(`${config.serverBaseUrl}/spark_app/${notebookPath}/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch Spark app config');
    } else {
      const data = await response.json();
      console.log('Spark app config:', data);

      const data_transformed = {};

      const executorMemory = data['spark.executor.memory'];
      const memoryUnit = executorMemory.slice(-1);
      const memoryValue = executorMemory.slice(0, -1);
      data_transformed.executor_memory = memoryValue;
      data_transformed.executor_memory_unit = memoryUnit;

      const executorCores = data['spark.executor.cores'];
      data_transformed.executor_cores = executorCores;

      const executorInstances = data['spark.executor.instances'];
      data_transformed.executor_instances = executorInstances;

      return data_transformed;
    }
  }

  static async updateSparkAppConfig(notebookPath, sparkAppConfig) {
    const response = await fetch(`${config.serverBaseUrl}/spark_app/${notebookPath}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sparkAppConfig),
    });

    if (!response.ok) {
      throw new Error('Failed to update Spark app config');
    }
  }
}

export default SparkAppConfigModel;