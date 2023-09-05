import { parse } from "csv-parse";
import fs from "node:fs";

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_prad"] < 1.6 &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11
  );
}

fs.createReadStream("kepler_data.csv")
  //  pipe is basically a pipeline which connects a readble stream (source(fs.createReadStream)) to a writeable stream (destination(parse from csv-parse]))
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  // on is basically an event omitter
  .on("data", (data) => {
    if (isHabitable(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet["kepler_name"];
      })
    );
    console.log(`${habitablePlanets.length} habitable  planets found`);
  });
