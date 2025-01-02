const gulp = require('gulp');
const fork = require('child_process').fork;
const ts = require('gulp-typescript');

gulp.task('dev', gulp.series(function () {
    return gulp.series([ts(), gulp.watch({
        script: 'dist/main.js', ext: 'js', ignore: ['./public'], env: { NODE_ENV: 'development' }
    }).on('restart', gulp.series([ts(), function () {
        console.log('restart');
    }]))]);
}));

gulp.task('prod', function (cb) {
    const server = fork('./main.js', {
        env: {
            NODE_ENV: 'production',
            dburi: process.env.dburi,
            PORT: process.env.PORT,
            cookieSecret: process.env.cookieSecret,
            sessionSecret: process.env.sessionSecret,
            csurfSecret: process.env.csurfSecret,
        }
    });

    server.on('data', function (data) {
          process.stdout.write(data.toString());
    });

    server.on('close', function (code) {
          console.log('server process exited with code ' + code);
    });

    return cb();
});
