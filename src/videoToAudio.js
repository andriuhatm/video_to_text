var spawn = require("child_process").spawn;

class VideoToAudio {
  convert(filename) {
    return new Promise((resolve, reject) => {
      try {
        const proc = spawn("ffmpeg", [
          "-y",
          "-i",
          "./data/source/" + filename,
          "-ar",
          "16000",
          "-ac",
          "1",
          "./data/output/output.wav",
        ]);
        proc.stderr.setEncoding("utf8");
        proc.on("close", function () {
          resolve("./data/output/output.wav");
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
module.exports.VideoToAudio = VideoToAudio;
