export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    res.status(400).send("No path specified");
    return;
  }

  // Build raw.githubusercontent.com URL
  const targetUrl = `https://raw.githubusercontent.com/CoolUBG/coolubg-list/main/${path}`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      res.status(response.status).send("Error fetching from GitHub");
      return;
    }

    // Pass through content type (HTML, JS, CSS, images…)
    res.setHeader("Content-Type", response.headers.get("content-type"));
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
