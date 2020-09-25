var spawn = require("child_process").spawn;

class VideoToAudio {
  cmd = "ffmpeg";
  args = [
    "-y",
    "-i",
    "./data/source/vid.mp4",
    "-ar",
    "16000",
    "-ac",
    "1",
    "./data/output/outfile.wav",
  ];

  load(request) {
    return new Promise((resolve, error) => {
      const proc = spawn(this.cmd, this.args);

      proc.stderr.setEncoding("utf8");
      proc.stderr.on("data", function (data) {
        console.log(data);
      });

      proc.on("close", function () {
        console.log("finished");

        resolve();
      });
    });
  }
}
module.exports.VideoToAudio = VideoToAudio;
