import fs from "fs/promises";
// import fonter from "gulp-fonter";
import fonter from "gulp-fonter-unx";
import ttf2woff2Gulp from "gulp-ttf2woff2";
import path from "path";

export const otfToTtf = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.otf`, {
      encoding: false,
      allowEmpty: true,
    })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "FONTS[OTF->TTF]",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
};

export const ttfToWoff = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.ttf`, {
      base: `${app.path.srcFolder}/fonts`,
      encoding: false,
      removeBOM: false,
      allowEmpty: true,
    })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "FONTS[TTF->WOFF]",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      fonter({
        formats: ["woff"],
      })
    )
    .pipe(app.gulp.dest(`${app.path.buildFolder}/fonts`));
};

export const ttfToWoff2 = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.ttf`, {
      encoding: false,
      removeBOM: false,
      allowEmpty: true,
    })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "FONTS[TTF->WOFF2]",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(ttf2woff2Gulp())
    .pipe(app.gulp.dest(app.path.build.fonts));
};

export const fontsStyle = async () => {
  const fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;

  try {
    const fontsDirFiles = await fs.readdir(app.path.build.fonts);

    if (!fontsDirFiles || fontsDirFiles.length === 0) {
      console.log("Нет шрифтов для генерации fonts.scss");
      return;
    }

    const fileExists = await fs
      .access(fontsFile)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      console.log(
        "Файл fonts.scss уже существует. Удали его для перегенерации."
      );
      return;
    }

    await fs.writeFile(fontsFile, "");

    const processedFonts = new Set();

    for (const file of fontsDirFiles) {
      const ext = path.extname(file);
      const fontFileName = path.basename(file, ext);

      if (processedFonts.has(fontFileName)) continue;
      processedFonts.add(fontFileName);

      let [fontName, weightName] = fontFileName.split("-");

      if (!weightName) weightName = "regular";

      const weightMap = {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        heavy: 800,
        black: 900,
      };

      const fontWeight = weightMap[weightName.toLowerCase()] || 400;

      const fontFace = `@font-face {
        font-family: '${fontName}';
        font-display: swap;
        src: url("../fonts/${fontFileName}.woff2") format("woff2"),
            url("../fonts/${fontFileName}.woff") format("woff");
        font-weight: ${fontWeight};
        font-style: normal;
      }\n`;

      await fs.appendFile(fontsFile, fontFace);
    }

    console.log("fonts.scss успешно сгенерирован");
  } catch (err) {
    console.error("Ошибка в fontsStyle:", err);
    throw err; // передать ошибку Gulp-у
  }
};
