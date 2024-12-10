import config from '../config';


class SparkModel {
  constructor() {
  }

  static isSparkInfo(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Check if it's a Spark info div
    const sparkInfo = doc.querySelector('div');
    if (!sparkInfo || !sparkInfo.textContent.includes('Spark Session Information')) {
        return false;
    }

    // Verify it has an Application ID that starts with 'app-'
    const appIdElement = Array.from(doc.querySelectorAll('p'))
        .find(p => p.textContent.includes('Application ID:'));
    if (!appIdElement) {
        return false;
    }

    const appId = appIdElement.textContent.split(': ')[1];
    return appId && appId.startsWith('app-');
  }

  static async storeSparkInfo(sparkAppId, notebookPath) {
    // Only store if it's an actual Spark application ID
    if (!sparkAppId.startsWith('app-')) {
      console.log('Not a valid Spark application ID:', sparkAppId);
      return;
    }

    try {
        const checkResponse = await fetch(`${config.serverBaseUrl}/spark_app/${sparkAppId}/status`);
        if (checkResponse.ok) {
            console.log('Spark app ID already exists:', sparkAppId);
            return;
        }
    } catch (error) {
        console.log('App ID does not exist, proceeding with storage');
    }

    const response = await fetch(`${config.serverBaseUrl}/spark_app/${sparkAppId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            notebookPath: notebookPath,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to store Spark application id: ${response.status}`);
    }
  }

  static extractSparkAppId(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const appIdTag = Array.from(doc.querySelectorAll('p'))
        .find(p => p.textContent.includes('Application ID:'));
    
    if (!appIdTag) return null;
    
    const appId = appIdTag.textContent.split(': ')[1];
    return appId && appId.startsWith('app-') ? appId : null;
  }

  static async createSparkSession(notebookPath) {
    try {
        console.log('Creating Spark session for notebook:', notebookPath);
        const response = await fetch(`${config.serverBaseUrl}/spark_app/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notebookPath: notebookPath
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create Spark session');
        }

        // Create a cell with Spark initialization code
        const sparkInitCode = `spark = create_spark("${notebookPath}")
spark`;

        return {
            initializationCode: sparkInitCode
        };
    } catch (error) {
        console.error('Error creating Spark session:', error);
        throw error;
    }
  }
}

export default SparkModel;


