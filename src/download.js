const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");

const graph = require("./graph.json");

const jobs = graph.data.networkData.dataNodes
  .filter(({ profilePhoto }) => !!profilePhoto)
  .map(async ({ id, profilePhoto }) => {
    const path = Path.resolve(__dirname, "../public/twitter", `${id}.jpg`);
    const writer = Fs.createWriteStream(path);

    const response = await Axios({
      url: profilePhoto,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  });

Promise.all(jobs);
