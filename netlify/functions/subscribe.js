exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, body: '' };
  }

  const email = String(body.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { statusCode: 400, body: '' };

  const endpoint = process.env.SUBSTACK_SUBSCRIBE_URL || 'https://newsletter.alexanderson.tv/api/v1/free?nojs=true';
  const params = new URLSearchParams({
    email,
    first_url: body.source_url || 'https://alexanderson.tv/fog/',
    current_url: body.source_url || 'https://alexanderson.tv/fog/',
    source: 'fog-film'
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'alexanderson.tv subscription proxy' },
      body: params.toString(),
      redirect: 'follow'
    });
    return { statusCode: response.ok ? 200 : 502, body: '' };
  } catch (_) {
    return { statusCode: 502, body: '' };
  }
};
