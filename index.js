import express from 'express';
import Replicate from 'replicate';

const app = express();

// Middleware para manejar JSON //
app.use(express.json());

// Endpoint para generar imágenes
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY, //Se importa api desde .env previamente generada en replicate
  });

  const input = {
    cfg: 4.5,
    steps: 28,
    prompt,
    aspect_ratio: "3:2",
    output_format: "webp",
    output_quality: 90,
    negative_prompt: "ugly, distorted",
    prompt_strength: 0.85
  };

  try {
    const output = await replicate.run("stability-ai/stable-diffusion-3", { input });
    console.log(output);
    res.json({ output });
  } catch (error) {
    console.error('Error calling Replicate API:', error);
    res.status(500).json({ error: "An error occurred while generating the image" });
  }
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
