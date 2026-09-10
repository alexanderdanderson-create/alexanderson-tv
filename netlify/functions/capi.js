const ALLOWED_EVENTS = new Set(['VideoStart', 'Watch25', 'Watch50', 'Watch75', 'VideoComplete']);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, body: '' };
  }

  if (!ALLOWED_EVENTS.has(body.event_name) || typeof body.event_id !== 'string' || body.event_id.length > 160) {
    return { statusCode: 400, body: '' };
  }

  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return { statusCode: 503, body: '' };

  const payload = {
    data: [{
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      event_source_url: body.event_source_url,
      action_source: 'website',
      user_data: {
        client_user_agent: event.headers['user-agent'] || '',
        client_ip_address: (event.headers['x-nf-client-connection-ip'] || (event.headers['x-forwarded-for'] || '').split(',')[0] || '').trim()
      }
    }]
  };

  try {
    const response = await fetch('https://graph.facebook.com/v26.0/' + encodeURIComponent(pixelId) + '/events?access_token=' + encodeURIComponent(token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { statusCode: response.ok ? 200 : 502, body: '' };
  } catch (_) {
    return { statusCode: 502, body: '' };
  }
};
