var gulp = require("gulp");
var nodemon = require('gulp-nodemon');
var server = require('gulp-express');
var bower = require('gulp-bower');

var exec = require('child_process').exec;

gulp.task('dev', gulp.series(function () {
    return nodemon({script: 'main.js', ext: 'js', ignore: ['./public'], env: {'NODE_ENV': 'development'}}).on('restart', function () {
        console.log('restart');
    });
}));

gulp.task('bower', gulp.series(function(cb) {
    bower();
    return cb();
}));

gulp.task('prod', gulp.series(['bower'], function (cb) {
    var server = fork('./main.js', {
        env: {
            NODE_ENV: 'production',
            dburi: process.env.dburi,
            PORT: process.env.PORT
        }
    });

    server.on('data', function (data) {
          process.stdout.write(data.toString());
    });

    server.on('close', function (code) {
          console.log('server process exited with code ' + code);
    });

    return cb();
}));
