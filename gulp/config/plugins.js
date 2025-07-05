import browsersync from "browser-sync";
import gulpIf from "gulp-if";
import newer from "gulp-newer";
import gulpNotify from "gulp-notify";
import gulpPlumber from "gulp-plumber";
import gulpReplace from "gulp-replace";

export const plugins = {
  replace: gulpReplace,
  plumber: gulpPlumber,
  notify: gulpNotify,
  browsersync: browsersync,
  newer: newer,
  if: gulpIf,
};
