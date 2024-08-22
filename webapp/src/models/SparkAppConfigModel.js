import config from '../config';

class SparkAppConfigModel {
  constructor() {
  }

  static async getSparkAppConfigByNotebookId() {
    const response = await fetch(`${config.serverBaseUrl}/spark_app/${}/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch Spark app config');
    } else {
      const data = await response.json();
      return data;
    }
  }

  // static async updateSparkAppConfig(sparkAppConfig) {
  //   const response = await fetch(`${config.serverBaseUrl}/spark_app_config`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(sparkAppConfig),
  //   });

  //   if (!response.ok) {
  //     throw new Error('Failed to update Spark app config');
  //   }
  // }
}