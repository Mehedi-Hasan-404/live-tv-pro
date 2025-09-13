export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const { url, cookie } = req.query;
    
    if (!url) {
      res.status(400).json({ error: 'URL parameter is required' });
      return;
    }
    
    // Decode URL if it's encoded
    const decodedUrl = decodeURIComponent(url);
    
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        ...(cookie && { 'Cookie': cookie })
      }
    });
    
    // Set appropriate headers for HLS streaming
    res.status(response.status);
    
    // Forward important headers for HLS
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      res.setHeader('Cache-Control', cacheControl);
    }
    
    const expires = response.headers.get('expires');
    if (expires) {
      res.setHeader('Expires', expires);
    }
    
    // Handle different response types
    if (response.body) {
      response.body.pipe(res);
    } else {
      const data = await response.buffer();
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed: ' + error.message });
  }
}
