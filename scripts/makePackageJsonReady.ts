import fs from "fs";

const isDev = process.env.NODE_ENV === "development";

const watchPackages = ["core", "utils"];
let packageNames = "";

const changePackageFiles = (packageName: string, index: number) => {
  const location = `./packages/${packageName}/package.json`;
  const file = fs.readFileSync(location, "utf-8");
  const json = JSON.parse(file);
  if (!isDev) {
    json["main"] = "./dist/index.mjs";
    json["typings"] = "./dist/index.d.ts";
    json["module"] = "./dist/index.mjs";
  } else {
    delete json.typings;
    delete json.module;
    json["main"] = "./src/index.ts";
  }
  fs.writeFileSync(location, JSON.stringify(json));
  if (index > 0) packageNames = `${packageNames}, ${json.name}`;
  else packageNames = `${json.name}`;
};

watchPackages.forEach(changePackageFiles);
console.info(
  `- Changing package entries of ${packageNames} for ${process.env.NODE_ENV} environment.\n`
);
