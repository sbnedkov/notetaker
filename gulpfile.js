const { dest, parallel, series, src, task, watch } = require('gulp');
const fork = require('child_process').fork;
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

let server;

task('build', function () {
    const tsProject = ts.createProject('./tsconfig.json');

    return src('./src/**/*')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../lib' }))
        .pipe(dest('./dist'));
});

task('prod', function (cb) {
    server = fork('./dist/main.js', {
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

task('kill', function (cb) {
    server.kill('SIGINT');
    return cb();
});

task('watch', cb => watch(['./src/**/*'], series([cb => { console.log('restarting...'); cb(); } , 'kill', 'build', 'prod', 'watch', () => cb()])));

task('dev', parallel([series(['build', 'prod']), 'watch']));
