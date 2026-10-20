
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  return res.status(501).json({
    error: "Backend setup is not complete yet."
  });
}
