// Proxy a OpenAI — requiere OPENAI_API_KEY en Netlify (Site settings → Environment variables)
export async function handler(event) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };

  try {
    const { message, profile } = JSON.parse(event.body || '{}');
    if (!message) return { statusCode: 400, headers: cors, body: 'message is required' };

    const apiKey = process.env.OPENAI_API_KEY;
    const system = `Eres Mira, tutor de micro-formación para creativos. Responde en español, breve y accionable. Usa el perfil cuando esté.`;

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `Perfil:${JSON.stringify(profile||{})}
Pregunta:${message}` }
        ]
      })
    });

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || 'Sin respuesta.';
    return { statusCode: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, answer: text }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ ok: false, error: String(e) }) };
  }
}
