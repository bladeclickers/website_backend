export default async function handler(req, res) {
  const { path } = req.query; // e.g., game1/index.html

  if (!path) {
    res.status(400).send("No path specified");
    return;
  }

  const targetUrl = `https://raw.githubusercontent.com/CoolUBG/coolubg-list/main/${path}`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      res.status(response.status).send("Error fetching from GitHub");
      return;
    }

    let html = await response.text();

    // Rewrite all relative src/href URLs to absolute raw.githubusercontent URLs
    const baseURL = `https://raw.githubusercontent.com/CoolUBG/coolubg-list/main/${path.replace(/\/index\.html$/, '')}/`;
    html = html.replace(/(src|href)="(?!https?:\/\/)([^"]+)"/g, (match, attr, url) => {
      return `${attr}="${baseURL}${url}"`;
    });

    res.setHeader("Content-Type", "text/html");
    res.send(html);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
