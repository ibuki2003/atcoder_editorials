/**
 * Custom router only for API route
 * This *force* method is to support aspida.
 * This perhaps have some bugs because of lack of debugging
 */

import { NextApiResponse, NextApiRequest } from "next";
import fs from "fs";
import { join } from "path";

const ext_ptn = /\.\w+$/;
function get_dynamic_name(filename: string) {
  filename = filename.replace(ext_ptn, "");
  return filename.slice(1); // remove leading "_"
}

interface MatchedRoute {
  path: string;
  params: Record<string, string>;
}

async function searchMatchFiles(
  path: string[],
  dir: string
): Promise<MatchedRoute | undefined> {
  const l = await new Promise<fs.Dirent[]>((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) throw reject(err);
      resolve(files);
    });
  });

  const files = new Set(
    l.filter((f) => !f.name.startsWith("_") && f.isFile()).map((f) => f.name)
  );
  const dirs = new Set(
    l
      .filter((f) => !f.name.startsWith("_") && f.isDirectory())
      .map((f) => f.name)
  );
  // const dirs = Set(l.filter((f)=>f.isDirectory()).map(f=>f.name));
  const dynamic = l.reduce<fs.Dirent | null>(
    (b, f) => b || (f.name.startsWith("_") ? f : null),
    null
  );

  if (path.length === 0) {
    // index
    if (files.has("index.ts")) {
      return { path: "index", params: {} };
    }
    return undefined; // 404
  } else {
    if (path.length === 1 && files.has(path[0] + ".ts"))
      return {
        path: path[0],
        params: {},
      };
    if (dirs.has(path[0])) {
      const ret = await searchMatchFiles(path.slice(1), join(dir, path[0]));
      if (ret) {
        ret.path = join(path[0], ret.path);
        return ret;
      }
    }
    if (dynamic) {
      if (dynamic.isFile()) {
        return {
          path: dynamic.name,
          params: { [get_dynamic_name(dynamic.name)]: path[0] },
        };
      } else {
        const ret = await searchMatchFiles(
          path.slice(1),
          join(dir, dynamic.name)
        );
        if (!ret) return; // 404
        ret.path = join(dynamic.name, ret.path);
        ret.params[get_dynamic_name(dynamic.name)] = path[0];
        return ret;
      }
    }
  }
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { path, ...query } = req.query;
  const patharray = Array.isArray(path) ? path : [path];

  const ret = await searchMatchFiles(patharray, "src/pages/api/apis");
  if (ret === undefined) {
    res.status(404).json({ error: "route not found" });
    res.end();
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const m = require("./apis/" + ret.path);
  const req_ = req;
  req_.query = Object.assign(ret.params, query);
  return await (m.default || m)(req_, res);
};
