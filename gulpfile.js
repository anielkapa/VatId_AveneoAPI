var	gulp	=	require('gulp');
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var	sourcemaps	=	require('gulp-sourcemaps');

gulp.task("sass", function (){
  return gulp.src("scss/**/*.scss")
  .pipe(sourcemaps.init())
  .pipe(plumber())
  .pipe(sass({
    outputStyle: "expanded",
    sourceComments: 'map'
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('css'))
});

gulp.task('watch',	function()	{
		gulp.watch('scss/**/*.scss',	['sass']);

});
