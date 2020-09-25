const express = require("express");
const router = express.Router();
const { Transcriber } = require("../src/Transcriber");
const { VideoToAudio } = require("../src/videoToAudio");

router.get("/", async (req, res) => {
  try {
    res.json({ hello: "world" });
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const converter = new VideoToAudio();

    converter.load(req.body).then(() => {
      console.log("finished conversion");

      const transcriber = new Transcriber("./data/output/outfile.wav");
      transcriber.loadTranscript().then((result) => {
        res.json(result);
      });
    });
  } catch (err) {
    console.error(err);
    res.send(err.message ? err.message : err);
  }
});

module.exports = router;
