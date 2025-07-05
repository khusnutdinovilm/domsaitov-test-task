import imagemin from "gulp-imagemin";
import webp from "gulp-webp";

export const imageWebp = () => {
  return app.gulp
    .src(app.path.src.images, { encoding: false })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "IMAGES[WEBP]",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(webp())
    .pipe(app.gulp.dest(app.path.build.images));
};

export const imageMin = () => {
  return app.gulp
    .src(app.path.src.images, { encoding: false, allowEmpty: true })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "IMAGES[MINIFY]",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3, // 0 to 7
      })
    )
    .pipe(app.gulp.dest(app.path.build.images));
};

export const imageSvg = () => {
  return app.gulp
    .src(app.path.src.svg, { encoding: false, allowEmpty: true })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "IMAGES[SVG]",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(app.gulp.src(app.path.src.svg, { encoding: false, allowEmpty: true }))
    .pipe(app.gulp.dest(app.path.build.images));
};
