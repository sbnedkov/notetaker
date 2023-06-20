var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var fork = require('child_process').fork;

gulp.task('dev', gulp.series(function () {
    return nodemon({
        script: 'main.js', ext: 'js', ignore: ['./public'], env: { NODE_ENV: 'development' }
    }).on('restart', function () {
        console.log('restart');
    });
}));

gulp.task('prod', gulp.series([], function (cb) {
    var server = fork('./main.js', {
        env: {
            NODE_ENV: 'production',
            dburi: process.env.dburi,
            PORT: process.env.PORT,
            sessionsecret: process.env.sessionsecret
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
