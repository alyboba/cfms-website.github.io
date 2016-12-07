var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var Server = require('karma').Server;

gulp.task('autoprefixer', function () {
    return gulp.src('./_site/precompiled/*.css')
        .pipe(postcss([autoprefixer({ browsers: ['last 2 version'] })]))
        .pipe(gulp.dest('./stylesheets/'));
});

gulp.task('minify-css', function () {
    gulp.task('minify-css', function () {
        return gulp.src('./_site/precompiled/*.css')
            .pipe(minifyCss({ compatibility: 'ie8' }))
            .pipe(gulp.dest('./stylesheets/'));
    });
});

gulp.task('sass', function () {
    return gulp
        .src('./precompiled/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(postcss([autoprefixer({ browsers: ['last 2 version'] })]))
        .pipe(gulp.dest('./compiled_css/'));
});

gulp.task('default', function () {
    return gulp.src('./_site/precompiled/*.css')
        .pipe(postcss([autoprefixer({ browsers: ['last 2 version'] })]))
        .pipe(gulp.dest('./stylesheets/'))
        .pipe(minifyCss({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./stylesheets/'));
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

// add custom browserify options here
var customOpts = {
    entries: ['./_src/app.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)).transform(babelify, { presets: ['es2015'] });

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./js'));
}