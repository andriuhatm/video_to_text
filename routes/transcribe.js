const express = require("express");
const fs = require("fs");
const router = express.Router();
const { Transcriber } = require("../src/Transcriber");
const { VideoToAudio } = require("../src/videoToAudio");

router.get("/", async (req, res) => {
  try {
    res.render("index", { title: "Hey", message: "Hello there!" });
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const file = req.files.file;
    file.mv("/tmp/" + file.name);

    const converter = new VideoToAudio();
    converter.convert(file.name).then(
      (audioFile) => {
        const transcriber = new Transcriber(audioFile);
        transcriber.loadTranscript().then(
          (result) => {
            try {
              fs.unlinkSync("/tmp/" + file.name);
              fs.unlinkSync(audioFile);
            } catch (err) {
              console.error(err);
            }

            res.render("results", { result: result });
          },
          (err) => {
            console.error(err);
          }
        );
      },
      (err) => {
        console.error(err);
      }
    );
  } catch (err) {
    console.error(err);
    res.send(err.message ? err.message : err);
  }
});

module.exports = router;
