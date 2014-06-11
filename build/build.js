"use strict"

const fs = require('fs');

function cleanUpDirList (dirs) {
  var validDirs = [];
  dirs.forEach(function (dir) {
    if (dir[0] != '.') {
      validDirs.push(dir);
    }
  });

  return validDirs;
}

function detectAvailableFontTypes (fontDir) {
  var fontFiles = cleanUpDirList( fs.readdirSync('../fonts/' + fontDir) );
  var types = [];
  fontFiles.forEach(function (fontFile) {
    var lastDot = fontFile.lastIndexOf('.');
    types.push( fontFile.slice(lastDot + 1) );
  });

  return types;
}

function createBuildMapObject (fontDirs) {
  var map = [];

  fontDirs.forEach(function (fontDir) {
    var font = {};
    font.fontName = fontDir;
    font.fontTypes = detectAvailableFontTypes(fontDir);

    map.push(font);
  });

  return map;
}

function renderSingleFontFace (fontName) {
  var tmpl = "@font-face {\n" +
  "\tfont-family: '^.^FontName';\n" +
  "\tsrc: url('../fonts/^.^FontName/^.^FontName.eot'); /* IE9 Compat Modes */\n" +
  "\tsrc: url('../fonts/^.^FontName/^.^FontName.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */\n" +
       "\t\turl('../fonts/^.^FontName/^.^FontName.woff') format('woff'), /* Modern Browsers */\n" +
       "\t\turl('../fonts/^.^FontName/^.^FontName.ttf')  format('truetype'); /* Safari, Android, iO */\n" +
  "}\n";

  return tmpl.replace(/\^\.\^FontName/g, fontName);
}

function renderBatchFontFace (fontNames) {
  var fontFaces = '';
  fontNames.forEach(function (fontName) { 
    fontFaces += renderSingleFontFace(fontName);
  });
  return fontFaces;
}

function createFontFacesStyleSheet (fontNames) {
  var fontFaces = renderBatchFontFace(fontNames);
  fs.writeFileSync('../css/fonts.css', fontFaces); 
}

function renderSingleFontCssSelector (fontName) {
  var tmpl =  '[data-font-family=^.^] {\n' +
                '\tfont-family: "^.^";\n' +
              '}\n';
  return tmpl.replace(/\^\.\^/g, fontName)
}

function renderBatchFontCssSelector (fontNames) {
  var cssSelectors = '';
  fontNames.forEach(function (fontName) {
    cssSelectors += renderSingleFontCssSelector(fontName);
  });
  return cssSelectors;
}

function createStyleSheetFromFonts (fontNames) {
  var cssSelectors = renderBatchFontCssSelector(fontNames);
  fs.writeFileSync('../css/style.css', cssSelectors);
}

var dirList = cleanUpDirList(fs.readdirSync('../fonts/'));
createStyleSheetFromFonts(dirList);

//console.log( detectAvailableFontTypes(dirList[0]) );
//console.log(buildBatchFontCssSelector(dirList));
//console.log(buildSingleFontCssSelector('BYekan'));
//console.log(createBuildMapObject(dirList));

createStyleSheetFromFonts(dirList);
createFontFacesStyleSheet(dirList);
