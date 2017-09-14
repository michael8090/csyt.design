import gulp from 'gulp';
import gutil from 'gulp-util';
import yargs from 'yargs';
import webpack from 'webpack';
import webpackServerCommonConfig from './webpack/server/common';
import { spawn, exec } from 'child_process';
import runSequnce from 'run-sequence';
import rimraf from 'rimraf';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import builtins from 'builtin-modules';

const args = yargs.alias('d', 'develop').argv;

const isDev = !!args.develop;

process.env.NODE_ENV = isDev ? 'develop' : 'production';

gutil.log(`it's on ${process.env.NODE_ENV} mode`);

gulp.task('clean', function() {
    rimraf.sync('build');
});

function webpackBuild(webpackConfig, done, onUpdate) {
    webpack(webpackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString('minimal'));
        if (isDev) {
            gutil.log('watching...');
            if (onUpdate) {
                onUpdate();
            }
        } else {
            done();
        }
    });
}

let serverProcess;

function restartServer() {
    gutil.log(serverProcess ? 'restarting server...' : 'starting server...');
    if (serverProcess) {
        serverProcess.kill();
    }
    serverProcess = spawn('node', ['server.js'], {
        cwd: 'build/server',
    });
    serverProcess.stdout.on('data', message => gutil.log(message.toString()));
    serverProcess.stderr.on('data', message => gutil.log(message.toString()));

    serverProcess.on('exit', () => gutil.log('server is stopped'));
}

let oldPackages = [];
const serverOutputFolder = webpackServerCommonConfig.output.path;

function installPackages(newPackages = []) {
    function inOutputFolder(fn) {
        const cwd = process.cwd();
        process.chdir(serverOutputFolder);
        try {
            fn();
        } catch (e) {
            throw e;
        } finally {
            process.chdir(cwd);
        }
    }
    function remove(packageName) {
        inOutputFolder(() => {
            gutil.log(`removing ${packageName}`);
            rimraf.sync(path.resolve('node_modules', packageName));
        });
    }
    function install(packageName) {
        return new Promise((resolve, reject) => {
            inOutputFolder(() => {
                gutil.log(`installing ${packageName}`);
                mkdirp('node_modules');
                exec(`npm install ${packageName}`, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        });
    }
    const packages = oldPackages.concat(newPackages);
    const toBeInstalled = [];
    for (let p of packages) {
        const isInOldPackages = oldPackages.indexOf(p) !== -1;
        const isInNewPackages = newPackages.indexOf(p) !== -1;

        if (isInOldPackages !== isInNewPackages) {
            if (isInOldPackages) {
                remove(p);
            } else {
                toBeInstalled.push(p);
            }
        }
    }
    oldPackages = newPackages;
    return Promise.all(toBeInstalled.map(install));
}

function scanPackages(str) {
    const regex = /require\(\"(.*)\"\)/g;
    let match;
    const packages = [];
    while ((match = regex.exec(str))) {
        if (match) {
            const [t, pachageName] = match;
            if (pachageName) {
                if (packages.indexOf(pachageName) === -1) {
                    packages.push(pachageName);
                }
            }
        }
    }
    return packages.filter(p => builtins.indexOf(p) === -1);
}

function syncPackage() {
    return installPackages(
        scanPackages(
            fs
                .readFileSync(path.resolve(serverOutputFolder, 'server.js'))
                .toString()
        )
    );
}

gulp.task('build-client', function(done) {
    webpackBuild(
        isDev
            ? require('./webpack/client/develop')
            : require('./webpack/client/production'),
        done
    );
});

gulp.task('build-server', function(done) {
    webpackBuild(
        isDev
            ? require('./webpack/server/develop')
            : require('./webpack/server/production'),
        done,
        restartServer
    );
});

gulp.task('start-server', restartServer);

gulp.task('build', ['clean'], () =>
    runSequnce(['build-server', 'build-client'])
);
