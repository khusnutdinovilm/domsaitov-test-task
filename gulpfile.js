import gulp from "gulp";

import { path } from "./gulp/config/path.js";

import { plugins } from "./gulp/config/plugins.js";
import { html } from "./gulp/tasks/html.js";
import { js } from "./gulp/tasks/js.js";
import { reset } from "./gulp/tasks/reset.js";
import { scss } from "./gulp/tasks/scss.js";
import { server } from "./gulp/tasks/server.js";

import {
  fontsStyle,
  otfToTtf,
  ttfToWoff,
  ttfToWoff2,
} from "./gulp/tasks/fonts.js";
import { imageMin, imageSvg, imageWebp } from "./gulp/tasks/images.js";

global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  path: path,
  gulp: gulp,
  plugins: plugins,
};

const imageTasks = gulp.series(imageWebp, imageMin, imageSvg);
const fontTasks = gulp.series(otfToTtf, ttfToWoff, ttfToWoff2, fontsStyle);

function watcher() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, imageTasks);
}

const mainTasks = gulp.series(
  fontTasks,
  gulp.parallel(html, scss, js, imageTasks)
);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

export { build, dev };

gulp.task("default", dev);
