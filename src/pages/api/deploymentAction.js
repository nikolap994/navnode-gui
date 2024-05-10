export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { action, environment } = req.body;

  try {
    res.status(200).json({
      message: `Action '${action}' executed successfully on '${environment}'`,
    });
  } catch (error) {
    console.error("Error executing deployment action:", error);
    res.status(500).json({ error: "Failed to execute deployment action" });
  }
}
