var gulp = require("gulp");
var nodemon = require('gulp-nodemon');
var server = require('gulp-express');
var bower = require('gulp-bower');

var exec = require('child_process').exec;

gulp.task('dev', function () {
    return nodemon({script: 'main.js', ext: 'js', ignore: ['./public'], env: {'NODE_ENV': 'development'}}).on('restart', function () {
        console.log('restart');
    });
});

gulp.task('bower', function() {
    return bower();
});

gulp.task('prod', ['bower'], function () {
    exec('NODE_ENV=production node main.js $PORT', function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
});
