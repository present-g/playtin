var syntax = 'scss', // Syntax: sass or scss;
    gulpversion = '4'; // Gulp version: 3 or 4

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    csscomb = require('gulp-csscomb'),
    del = require('del'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    //pngquant      = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    rsync = require('gulp-rsync');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        // open: false,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
});

gulp.task('styles', function() {
    return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
        .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(csscomb())
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
});

gulp.task('styles-read', function() {
    return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
        .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(csscomb())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
});

gulp.task('scripts', function() {
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/owl-carusel/dist/owl.carousel.min.js',
            'app/js/common.js', // Always at the end
        ])
        .pipe(concat('scripts.min.js'))
        // .pipe(uglify()) // Mifify js (opt.)
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', async function() {
    return del.sync('dist');
});

gulp.task('img', async function() {
    return gulp.src('app/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('dist/img'));
})

gulp.task('code', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
    return gulp.src('app/**')
        .pipe(rsync({
            root: 'app/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            // include: ['*.htaccess'], // Includes files to deploy
            exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }))
});

gulp.task('build', gulp.series('clean', 'styles', 'styles-read', 'scripts', 'img', async function() {

    var buildCss = gulp.src('app/css/*.css')
        .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/scripts.min.js')
        .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));


}));

if (gulpversion == 3) {
    gulp.task('watch', ['styles', 'styles-read', 'scripts', 'browser-sync'], function() {
        gulp.watch('app/scss/**/*.scss', ['styles', 'styles-read']);
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
        gulp.watch('app/*.html', ['code'])
    });
    gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
    gulp.task('watch', function() {
        //gulp.watch('app/scss/**/*.scss', gulp.parallel('styles'));
        gulp.watch('app/scss/**/*.scss', gulp.parallel('styles-read'));
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
        gulp.watch('app/*.html', gulp.parallel('code'))
    });
    gulp.task('default', gulp.parallel('styles', 'styles-read', 'scripts', 'browser-sync', 'watch'));
}