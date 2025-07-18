const fetch = require('node-fetch');

exports.handler = async () => {
  const repo = process.env.GITHUB_REPO;
  const filePath = process.env.GITHUB_FILE_PATH;
  const url = `https://raw.githubusercontent.com/${repo}/main/${filePath}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Impossibile caricare i dati' })
      };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore server' })
    };
  }
};
