"use strict";

const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const notify = require("gulp-notify");
const imagemin = require("gulp-imagemin");
const pug = require('gulp-pug');
const newer = require('gulp-newer');
const cached = require('gulp-cached');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');
const gulpIf = require('gulp-if');
const spritesmith = require('gulp.spritesmith');
const del = require('del');
const ghPages = require('gulp-gh-pages');
const webpack = require('webpack');
const webpackGulp = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const reload = browserSync.reload;

//settings
const srcPath = 'src';
const buildPath = 'build';
const coreBitrixPath = 'test';
const buildPathBitrix = {
    css: coreBitrixPath+'/css',
    libs: coreBitrixPath+'/libs',
    js: coreBitrixPath+'/js',
    fonts: coreBitrixPath+'/fonts',
    img: coreBitrixPath+'/img'
};
const buildBitrix = false;
const buildWebpack = false;
const proxy = false;
const other = false;
//settings

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var path = {
    build: {
        pug: buildPath+'/',
        js: {
            webpack: buildPath+'/js/',
            common: buildPath+'/js/'
        },
        css: buildPath+'/css/',
        fonts: buildPath+'/fonts/',
        data: buildPath+'/data/',
        icons: srcPath+'/img/',
        img: buildPath+'/img/'
    },
    src: {
        pug: srcPath+'/pug/!(_)*.pug',
        js: {
            webpack: srcPath+'/js/webpack/**/*',
            common: srcPath+'/js/common/*.js'
        },
        css: srcPath+'/scss/**/*.scss',
        fonts: srcPath+'/fonts/**/*',
        data: srcPath+'/data/**/*',
        icons: srcPath+'/icons/*.png',
        img: srcPath+'/img/**/*.{png,jpg,svg}'
    },
    watch: {
        html: srcPath+'/html/**/*.html',
        php: srcPath+'/php/**/*.php',
        pug: srcPath+'/pug/*.pug',
        blocks: srcPath+'/pug/blocks/**/*.pug',
        js: {
            webpack: srcPath+'/js/webpack/**/*.js',
            common: srcPath+'/js/common/**/*.js',
        },
        css: [srcPath+'/scss/**/*.scss', srcPath+'/pug/blocks/**/*.scss'],
        fonts: srcPath+'/fonts/**/*',
        data: srcPath+'/data/**/*',
        icons: srcPath+'/icons/**/*',
        img: srcPath+'/img/**/*'
    }
};

/*-------------------------------------------------*/
/*  server
/*-------------------------------------------------*/
gulp.task("server", function(){
    if(proxy){
        browserSync({
            proxy: proxy
        });
    }else{
        browserSync({
            server: {
                baseDir: "./build"
            },
            host: 'localhost',
            port: 3000
        });
    }
});

/*-------------------------------------------------*/
/*  pug
/*-------------------------------------------------*/
gulp.task('build:pug', function(){
    var YOUR_LOCALS = {};
    return gulp.src(path.src.pug, {since: gulp.lastRun('build:pug')})
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Jade',
                    message: err.message
                }
            })
        }))
        .pipe(pug({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest(path.build.pug))
        .pipe(browserSync.stream())
});

/*-------------------------------------------------*/
/*  pug blocks
/*-------------------------------------------------*/
gulp.task('build:blocks', function(){
    var YOUR_LOCALS = {};
    return gulp.src(path.src.pug)
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Jadeblocks',
                    message: err.message
                }
            })
        }))
        .pipe(pug({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest(path.build.pug))
        .pipe(browserSync.stream())
});

/*-------------------------------------------------*/
/*  javascript
/*-------------------------------------------------*/
gulp.task('build:webpack', function(callback){
    if(buildWebpack){
    return gulp.src(path.src.js.webpack, {since: gulp.lastRun('build:webpack')})
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'JS',
                    message: err.message
                }
            })
        }))
        .pipe(webpackGulp(webpackConfig, webpack))
        .pipe(gulp.dest(path.build.js.common))
        .pipe(gulpIf(buildBitrix, gulp.dest(buildPathBitrix.js)))
        .pipe(browserSync.stream());
    }
    else{
        callback();
    }
});

gulp.task('build:js', function(){
    return gulp.src(path.src.js.common, {since: gulp.lastRun('build:js')})
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'JS',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest(path.build.js.common))
        .pipe(gulpIf(buildBitrix, gulp.dest(buildPathBitrix.js)))
        .pipe(browserSync.stream());
});


/*-------------------------------------------------*/
/*  styles
/*-------------------------------------------------*/
gulp.task('build:css', function(){
    return gulp.src(path.src.css)
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(prefixer())
        .pipe(gulpIf(buildBitrix, gulp.dest(buildPathBitrix.css)))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())
});

/*-------------------------------------------------*/
/*  images
/*-------------------------------------------------*/
gulp.task('build:img', function(){
    return gulp.src(path.src.img)
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Images',
                    message: err.message
                }
            })
        }))
        .pipe(cached())
        .pipe(gulpIf(buildBitrix, gulp.dest(buildPathBitrix.img)))
        .pipe(gulp.dest(path.build.img))
});

/*-------------------------------------------------*/
/*  imagemin
/*-------------------------------------------------*/
gulp.task('build:imagemin', function(){
    return gulp.src(path.build.img+'**/*.{png,svg,jpg,gif}')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'ImagesMinifier',
                    message: err.message
                }
            })
        }))
        .pipe(cached())
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulpIf(buildBitrix, gulp.dest(buildPathBitrix.img)))
        .pipe(gulp.dest(path.build.img))
});

/*-------------------------------------------------*/
/*  fonts
/*-------------------------------------------------*/
gulp.task('build:fonts', function(){
    return gulp.src(path.src.fonts)
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Fonts',
                    message: err.message
                }
            })
        }))
        .pipe(newer(path.src.fonts))
        .pipe(gulpIf(buildBitrix, gulp.dest(buildPathBitrix.fonts)))
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.stream());
});

/*-------------------------------------------------*/
/*  data
/*-------------------------------------------------*/
gulp.task('build:data', function(){
    return gulp.src(path.src.data)
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Data',
                    message: err.message
                }
            })
        }))
        .pipe(newer(path.src.data))
        .pipe(gulp.dest(path.build.data))
        .pipe(browserSync.stream());
});

/*-------------------------------------------------*/
/*  php
/*-------------------------------------------------*/
gulp.task('build:php', function(callback){
    browserSync.reload();
    callback();
});

/*-------------------------------------------------*/
/*  html
/*-------------------------------------------------*/
gulp.task('build:html', function(callback){
    browserSync.reload();
    callback();
});

/*-------------------------------------------------*/
/*  libs for bx
/*-------------------------------------------------*/
gulp.task('build:libs.bx', function(){
    return gulp.src('build/libs/**/*')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'libx for bx',
                    message: err.message
                }
            })
        }))
        .pipe(newer('build/libs/**/*'))
        .pipe(gulpIf(buildBitrix, gulp.dest(buildPathBitrix.libs)))
        .pipe(browserSync.stream());
});

/*-------------------------------------------------*/
/*  sprite
/*-------------------------------------------------*/
gulp.task('build:sprite', function (callback) {
    var spriteData = gulp.src(path.src.icons)
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(newer(path.src.icons)).pipe(spritesmith({
            imgName: 'icon-set.png',
            cssName: '_icon-set.scss',
            imgPath: '../img/icon-set.png',
            cssVarMap: function (sprite) {
                sprite.name = 'icon-' + sprite.name;
            }
        }));
    spriteData.img.pipe(gulp.dest(path.build.icons));
    spriteData.css.pipe(gulp.dest(srcPath+'/scss/_settings/'));
    callback();
});


/*-------------------------------------------------*/
/*  clean
/*-------------------------------------------------*/
gulp.task('clean', function(callback){
    cached.caches = {};
    del([coreBitrixPath, buildPath+'/*', '!'+buildPath+'/libs'],{force: true}).then(paths=>{
        callback();
    });
});

/*-------------------------------------------------*/
/*  gh-pages
/*-------------------------------------------------*/
gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages({
        	branch: 'master',
        	message: 'Update '+new Date().toLocaleString('en-GB')
        }));
});

/*-------------------------------------------------*/
/*  build
/*-------------------------------------------------*/
gulp.task('build', gulp.parallel(
    'build:pug',
    'build:css',
    'build:webpack',
    'build:js',
    'build:fonts',
    'build:data',
    'build:libs.bx',
    gulp.series(
        'build:img',
        'build:sprite',
        'build:imagemin'
    )
));

gulp.task('zip', function(){
    return gulp.src(buildPath+'/**/*')
        .pipe(zip('build.zip'))
        .pipe(gulp.dest('.'))
});

gulp.task('watch', function(){
    if(other){
        gulp.watch(path.watch.html, gulp.series('build:html'));
        gulp.watch(path.watch.php, gulp.series('build:php'));
    }

    if(buildBitrix){
        gulp.watch('build/libs/**/*', gulp.series('build:libs.bx'));
    }

    gulp.watch(path.watch.pug, gulp.series('build:pug'));
    gulp.watch(path.watch.blocks, gulp.series('build:blocks'));
    gulp.watch(path.watch.css, gulp.series('build:css'));
    gulp.watch(path.watch.js.webpack, gulp.series('build:webpack'));
    gulp.watch(path.watch.js.common, gulp.series('build:js'));
    gulp.watch(path.watch.icons, gulp.series('build:sprite'))
        .on('change', function(){
            browserSync.reload();
        })
        .on('add', function(){
            browserSync.reload();
        });
    gulp.watch(path.watch.img, gulp.series('build:img'))
        .on('change', function(){
            browserSync.reload();
        })
        .on('add', function(){
            browserSync.reload();
        })
        .on('unlink', function(path, stats){
            cached.caches = {};
            del(path.replace('src','build'), {force: true}).then(()=>{
                gulp.series('build:img');
                browserSync.reload();
            });
        });

    gulp.watch(path.watch.data, gulp.series('build:data'));
    gulp.watch(path.watch.fonts, gulp.series('build:fonts'));
});

gulp.task('default', gulp.series(
    'clean',
    'build',
    gulp.parallel('watch', 'server')
));
