import express from "express";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { buffer, fileName } = req.body;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    return res.status(503).json({
      message: "ImageKit is not configured. Set IMAGEKIT_PRIVATE_KEY in services/utils/.env.",
    });
  }
  if (!fileName || typeof buffer !== "string") {
    return res.status(400).json({
      message: "Image data and file name are required.",
    });
  }

  const dataUri = buffer.match(/^data:([^;]+);base64,([\s\S]+)$/);
  if (!dataUri) {
    return res.status(400).json({ message: "Invalid image data." });
  }

  try {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([Buffer.from(dataUri[2], "base64")], { type: dataUri[1] }),
      fileName,
    );
    formData.append("fileName", fileName);
    formData.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
      },
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("ImageKit upload failed:", response.status, result.message);
      return res.status(502).json({
        message: result.message || "ImageKit could not upload this image.",
      });
    }

    return res.json({ url: result.url });
  } catch (error) {
    console.error("ImageKit upload failed:", error.message);
    return res.status(502).json({ message: "Could not connect to ImageKit." });
  }
});

export default router;
