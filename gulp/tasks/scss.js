import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import dartSass from "sass";

import autoPrefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import webcss from "gulp-webpcss";

const sass = gulpSass(dartSass);

export const scss = () => {
  return (
    app.gulp
      .src(app.path.src.scss, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(app.plugins.replace(/@img\//g, "../img/"))
      .pipe(
        sass({
          outputStyle: "expanded",
        })
      )
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
      .pipe(
        app.plugins.if(
          app.isBuild,
          webcss({
            webClass: ".webp",
            noWebpClass: ".no-webp",
          })
        )
      )
      .pipe(
        app.plugins.if(
          app.isBuild,
          autoPrefixer({
            grid: true,
            overrideBrowsserslist: ["last 3 versions"],
            cascade: true,
          })
        )
      )
      // Расскоментировать, если нужен не сжатый дубль файла стилей
      // .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.if(app.isBuild, cleanCss()))
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
  );
};
