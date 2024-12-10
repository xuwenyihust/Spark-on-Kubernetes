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

        // Create a cell with Spark initialization code that uses the existing spark instance
        const sparkInitCode = `spark = create_spark("${notebookPath}")
spark`;

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


