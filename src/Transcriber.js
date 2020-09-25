const DeepSpeech = require("deepspeech");
const Fs = require("fs");
const Sox = require("sox-stream");
const MemoryStream = require("memory-stream");
const Duplex = require("stream").Duplex;
const Wav = require("node-wav");

class Transcriber {
  audioFile = null;
  desiredSampleRate = null;
  buffer = null;
  model = null;
  modelPath = "./models/deepspeech-0.8.2-models.pbmm";
  scorerPath = "./models/deepspeech-0.8.2-models.scorer";

  constructor(audioFile) {
    this.audioFile = audioFile;
    this.loadModels();
    this.decodeAudio();
  }

  loadModels() {
    this.model = new DeepSpeech.Model(this.modelPath);
    this.desiredSampleRate = this.model.sampleRate();
    this.model.enableExternalScorer(this.scorerPath);
  }

  decodeAudio() {
    if (!Fs.existsSync(this.audioFile)) {
      console.log("file missing:", this.audioFile);
      process.exit();
    }

    this.buffer = Fs.readFileSync(this.audioFile);
    const result = Wav.decode(this.buffer);

    if (result.sampleRate < this.desiredSampleRate) {
      console.error(
        "Warning: original sample rate (" +
          result.sampleRate +
          ") is lower than " +
          this.desiredSampleRate +
          "Hz. Up-sampling might produce erratic speech recognition."
      );
    }
  }

  bufferToStream(buffer) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  loadTranscript() {
    return new Promise((resolve, reject) => {
      try {
        let audioStream = new MemoryStream();
        this.bufferToStream(this.buffer)
          .pipe(
            Sox({
              global: {
                "no-dither": true,
              },
              output: {
                bits: 16,
                rate: this.desiredSampleRate,
                channels: 1,
                encoding: "signed-integer",
                endian: "little",
                compression: 0.0,
                type: "raw",
              },
            })
          )
          .pipe(audioStream);

        audioStream.on("finish", () => {
          let audioBuffer = audioStream.toBuffer();

          const audioLength =
            (audioBuffer.length / 2) * (1 / this.desiredSampleRate);
          console.log("audio length", audioLength);

          const result = this.model.stt(audioBuffer);
          console.log("result:", result);
          resolve(result);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports.Transcriber = Transcriber;
