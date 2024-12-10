import config from '../config';


class SparkModel {
  constructor() {
  }

  static isSparkInfo(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // Check if the HTML includes Spark info
    const sparkInfo = doc.querySelector('h3');
    console.log('sparkInfo:', sparkInfo);
    return sparkInfo && sparkInfo.textContent === 'Spark Session Information';
  }

  static async storeSparkInfo(sparkAppId, notebookPath) {
    const response = await fetch(`${config.serverBaseUrl}/spark_app/${sparkAppId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        'notebookPath':  notebookPath,
       }),
    });

    if (!response.ok) {
      throw new Error(`Failed to store Spark application id: ${response.status}`);
    }
  }

  static extractSparkAppId(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find the <p> tag that contains the application id
    const pTags = Array.from(doc.querySelectorAll('p'));
    const appIdTag = pTags.find(p => p.textContent.includes('Application ID:'));
    const applicationId = appIdTag ? appIdTag.textContent.split(': ')[1] : null;

    const sparkUiLink = doc.querySelector('a').href;

    return applicationId;
  }

  static async createSparkSession(notebookPath) {
    try {
        console.log('Creating Spark session for notebook:', notebookPath);
        // First get the config for this notebook
        const configResponse = await fetch(`${config.serverBaseUrl}/spark_app/${notebookPath}/config`);
        console.log('Config response:', configResponse);
        
        if (!configResponse.ok) {
            throw new Error('Failed to fetch Spark configuration');
        }
        const sparkConfig = await configResponse.json();
        console.log('Spark config:', sparkConfig);

        // Generate a unique spark app ID
        const sparkAppId = `spark-${Date.now()}`;

        // Create a cell with Spark initialization code that uses the config
        const sparkInitCode = `
from pyspark.sql import SparkSession

spark = SparkSession.builder\\
    .appName("${sparkAppId}")\\
    .master("spark://spark-master:7077")\\
    .config("spark.jars.packages", "io.delta:delta-spark_2.12:3.0.0")\\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")\\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")\\
    .config("spark.eventLog.enabled", "true")\\
    .config("spark.eventLog.dir", "/opt/data/spark-events")\\
    .config("spark.history.fs.logDirectory", "/opt/data/spark-events")\\
    .config("spark.sql.warehouse.dir", "/opt/data/spark-warehouse")\\
    .config("spark.executor.memory", "${sparkConfig['spark.executor.memory']}")\\
    .config("spark.executor.cores", ${sparkConfig['spark.executor.cores']})\\
    .config("spark.executor.instances", ${sparkConfig['spark.executor.instances']})\\
    .config("spark.driver.memory", "${sparkConfig['spark.driver.memory']}")\\
    .config("spark.driver.cores", ${sparkConfig['spark.driver.cores']})\\
    .getOrCreate()

spark
`;

        // Create the Spark session with this config
        const response = await fetch(`${config.serverBaseUrl}/spark_app/${sparkAppId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notebookPath: notebookPath,
                sparkInitCode: sparkInitCode
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create Spark session');
        }

        const data = await response.json();
        return {
            sparkAppId: sparkAppId,
            initializationCode: sparkInitCode
        };
    } catch (error) {
        console.error('Error creating Spark session:', error);
        throw error;
    }
}

}

export default SparkModel;


