// generated on 2018-07-24 using generator-webapp 3.0.1
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const md = require('./gulpConfig/markdown.js');
const path = require('path');
let dev = true;
gulp.task('styles', () => {
    return gulp.src('app/styles/*.scss')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.', 'node_modules', 'bower_components']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
            remove: false
        }))
        .pipe($.if(dev, $.sourcemaps.write()))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('scripts', () => {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.babel())
        .pipe($.if(dev, $.sourcemaps.write('.')))
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe(reload({
            stream: true
        }));
});

function lint(files) {
    return gulp.src(files)
        .pipe($.eslint({
            fix: true
        }))
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
    return lint('app/scripts/**/*.js')
        .pipe(gulp.dest('app/scripts'));
});
gulp.task('htmlTmpEjs', () => {
    return gulp.src('app/*.html')
        .pipe($.plumber())
        .pipe($.ejs({
            markdown: md
        }))
        .pipe(gulp.dest('.tmp'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task('html', ['styles', 'scripts'], () => {
    return gulp.src('app/*.html')
        .pipe($.ejs({
            markdown: md
        }))
        .pipe($.useref({
            searchPath: ['.tmp', 'app', '.']
        }))
        .pipe($.if(/\.js$/, $.uglify({
            compress: {
                drop_console: true
            }
        })))
        .pipe($.if(/\.css$/, $.cssnano({
            safe: true,
            autoprefixer: false
        })))
        .pipe($.if(/\.html$/, $.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: {
                compress: {
                    drop_console: true
                }
            },
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe($.htmlBeautify({indent_size: 4}))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
            .concat('app/fonts/**/*'))
        .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
    return gulp.src([
        'app/*',
        '!app/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('cleanTmp', del.bind(null, ['.tmp']));
gulp.task('serve', () => {
    runSequence(['cleanTmp', 'wiredep'], ['styles', 'scripts', 'fonts', 'htmlTmpEjs'], () => {
        browserSync.init({
            notify: false,
            port: 9000,
            server: {
                baseDir: ['.tmp', 'app'],
                directory: true,
                routes: {
                    '/bower_components': 'bower_components'
                }
            }
        });

        gulp.watch([
            'app/*.html',
            'app/images/**/*',
            '.tmp/fonts/**/*'
        ]).on('change', function () {
            setTimeout(reload, 200)
        });

        gulp.watch('app/styles/**/*.scss', ['styles']);
        gulp.watch('app/scripts/**/*.js', ['scripts']);
        gulp.watch('app/fonts/**/*', ['fonts']);
        gulp.watch(['app/*.html', 'app/htmlBlock/**/*.html'], ['htmlTmpEjs']);
        // gulp.watch('bower.json', ['wiredep', 'fonts']);
    });
});

gulp.task('serve:dist', ['default'], () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dist']
        }
    });
});

// inject bower components
gulp.task('wiredep', () => {
    gulp.src('app/styles/*.scss')
        .pipe($.filter(file => file.stat && file.stat.size))
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest('app/styles'));

    // gulp.src('app/*.html')
    //     .pipe(wiredep({
    //         exclude: ['bootstrap-sass'],
    //         ignorePath: /^(\.\.\/)*\.\./
    //     }))
    //     .pipe(gulp.dest('app'));
});
gulp.task('rev', function () {
    return gulp.src(['dist/**/*', '!dist/*.html'])
        .pipe(gulp.dest('../deploy/yaoNew'))
        .pipe($.rev())　　　　　　　　 //加上MD5戳
        .pipe(gulp.dest('../deploy/yaoNew')) //输出文件
        .pipe($.rev.manifest()) //生成rev-manifest.json，该文件用于替换HTML CSS文件中引用的MD5文件路径
        .pipe(gulp.dest('../deploy/yaoNew/')) //rev-manifest.json文件放在rev目录下
});
gulp.task('replace', () => {
    return gulp.src(['./rev-manifest.json', '../server/views/**/*'])
        .pipe($.revCollector({
            replaceReved: true,
        }))
        .pipe(gulp.dest('../server/views/'))
})
gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'build',
        gzip: true
    }));
});
gulp.task('build-rev', () => {
    return runSequence(['clean'], 'build', 'rev', 'replace');
})
gulp.task('default', () => {
    return new Promise(resolve => {
        dev = false;
        runSequence(['clean', 'wiredep'], 'build', resolve);
    });
});
