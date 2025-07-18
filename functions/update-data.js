const fetch = require('node-fetch');

exports.handler = async (event) => {
  const repo = process.env.GITHUB_REPO;
  const filePath = process.env.GITHUB_FILE_PATH;
  const token = process.env.GITHUB_TOKEN;

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Metodo non permesso' })
    };
  }

  try {
    const newData = JSON.parse(event.body);

    // Ottieni il file attuale per il SHA
    const getFileUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const getResponse = await fetch(getFileUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const fileData = await getResponse.json();
    const sha = fileData.sha;

    // Aggiorna il file
    const updateUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: 'Aggiornamento dati porta party',
        content: Buffer.from(JSON.stringify(newData, null, 2)).toString('base64'),
        sha: sha
      })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Impossibile aggiornare i dati' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Dati aggiornati con successo' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore server' })
    };
  }
};
