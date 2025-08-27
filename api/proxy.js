export default async function handler(req, res) {
  const { path } = req.query;

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

    const html = await response.text();
    res.setHeader("Content-Type", "text/html"); // important
    res.send(html);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
