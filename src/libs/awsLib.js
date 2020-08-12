import { Storage } from "aws-amplify";
import * as uuid from "uuid";

export async function s3Upload(file) {
  // const filename = `${Date.now()}-${file.name}`;
  const filename = uuid.v4() + file.name;

  const stored = await Storage.put(filename, file, {
    contentType: file.type,
    level: "public"
  });
  console.log("s3Upload");

  return stored.key;
}

export async function s3Download(filename) {
  const file = await Storage.get(filename);

  return file;
}

export async function s3Delete(filename) {
  await Storage.remove(filename);
}