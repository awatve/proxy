export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url).searchParams.get('url');
    if (!url) return new Response('Missing url', { status: 400 });

    try {
      const res = await fetch(url);
      let text = await res.text();

      // Prefix all TS segment URLs with the desired CORS proxy
      text = text.replace(/(https?:\/\/[^\n]+)/g, match => {
        // Only prefix .ts files
        if (match.endsWith('.ts')) {
          return `https://cors-proxy.cooks.fyi/${match}`;
        }
        return match;
      });

      return new Response(text, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (err) {
      return new Response('Failed to fetch URL', { status: 500 });
    }
  }
};
