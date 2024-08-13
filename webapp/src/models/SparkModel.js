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

}

export default SparkModel;


