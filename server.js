const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const { url, format } = req.body;
  if (!url) return res.status(400).send("URL inválida.");
  if (!format) return res.status(400).send("Formato não especificado.");

  let outputFile;
  let cmd;

  if (format === "mp3") {
    outputFile = "audio.mp3";
    cmd = `yt-dlp -x --audio-format mp3 -o "${outputFile}" "${url}"`;
  } else if (format === "mp4") {
    outputFile = "video.mp4";
    cmd = `yt-dlp -f "bv*+ba" -o "video" "${url}"`;
    //yt-dlp -f "bv*+ba" -o "video.mp4" https://www.youtube.com/watch?v=A1LvxVqxdLw
  } else {
    return res.status(400).send("Formato inválido.");
  }

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o comando: ${error.message}`);
      return res.status(500).send("Erro ao processar o download.");
    }
    res.download(outputFile, (err) => {
      if (err) console.error("Erro ao enviar o arquivo:", err);
    });
  });
});


app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
