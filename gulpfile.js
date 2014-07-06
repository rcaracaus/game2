/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var compass = require('gulp-compass');

// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src('app/js/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(reload({stream: true, once: true}));
});

// Optimize Images
gulp.task('images', function () {
    return gulp.src('app/images/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'images'}));
});

// Automatically Prefix CSS
gulp.task('styles:css', function () {
    return gulp.src('app/css/*.css')
        .pipe($.autoprefixer('last 1 version'))
        .pipe(reload({stream: true}))
        .pipe($.size({title: 'styles:css'}))
        .pipe(gulp.dest('dist/css'));
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
    return gulp.src('app/scss/**/*.scss')
  .pipe(compass({
    config_file: 'config.rb',
    css: 'app/css',
    sass: 'app/scss'
  }))
  .pipe(gulp.dest('dist/css'));
});

// Output Final CSS Styles
gulp.task('styles', ['styles:scss', 'styles:css']);

gulp.task('scripts', function() {
    return gulp.src('app/js/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
    return gulp.src('app/*.html')
        // Minify Any HTML
        .pipe($.minifyHtml())
        // Output Files
        .pipe(gulp.dest('dist'))
        // Size of the output
        .pipe($.size({title: 'html'}));
});

// Watch Files For Changes & Reload
gulp.task('serve', function () {
    browserSync.init(null, {
        server: {
            baseDir: ['dist']
        },
        notify: false
    });

    gulp.watch(['app/*.html'], reload);
    gulp.watch(['app/scss/**/*.{css,scss}'], ['styles']);
    gulp.watch(['app/js/**/*.js'], ['jshint']);
    gulp.watch(['app/js/**/*.js'], ['scripts']);
    gulp.watch(['app/images/*'], ['images']);
});

// Build Production Files
gulp.task('build', function (cb) {
    runSequence('styles', ['jshint', 'html'], cb);
});

// Default Task
gulp.task('default', ['clean'], function (cb) {
    gulp.start('build', cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
    // By default, we use the PageSpeed Insights
    // free (no API key) tier. You can use a Google
    // Developer API key if you have one. See
    // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
    url: 'https://example.com',
    strategy: 'mobile'
}));
