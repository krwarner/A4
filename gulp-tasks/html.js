const gulp = require('gulp');
const hb = require('gulp-hb');
const rename = require('gulp-rename');
const include = require('gulp-file-include');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const report = require('../report-error.js');
const browserSync = require('browser-sync');

const srcIndex = 'src/html/*.hbs';
const svgPath = `${process.cwd()}/svg/`;

gulp.task('html-dev', () => {
	const hbStream = hb()
		.partials('./src/html/partials/**/*.hbs')
		.helpers('./src/html/helpers/*.js')
		.data('./template-data/**/*.{js,json}')
		.data({ basepath: '', timestamp: Date.now() });

	return (
		gulp
			.src(srcIndex)
			.pipe(plumber({ errorHandler: report }))
			.pipe(hbStream)
			.pipe(include({ basepath: svgPath }))
			.pipe(
				rename(path => {
					path.extname = '.html';
				})
			)
			// .pipe(rename('index.html'))
			.pipe(gulp.dest('dev'))
			.pipe(browserSync.reload({ stream: true }))
	);
});

gulp.task('html-dist', () => {
	const hbStream = hb()
		.partials('./src/html/partials/**/*.hbs')
		.helpers('./src/html/helpers/*.js')
		.data('./template-data/**/*.{js,json}')
		.data({ basepath: 'https://github.com/krwarner/', timestamp: Date.now() });

	return gulp
		.src(srcIndex)
		.pipe(plumber({ errorHandler: report }))
		.pipe(hbStream)
		.pipe(include({ basepath: svgPath }))
		.pipe(
			rename(path => {
				path.extname = '.html';
			})
		)
		.pipe(gulp.dest('.tmp'));
});

gulp.task('html-boilerplate', () => {
	const hbStream = hb()
		.partials('./src/html/partials/**/*.hbs')
		// .helpers('./src/html/helpers/*.js')
		.data('./template-data/**/*.{js,json}')
		.data({ basepath: 'https://github.com/krwarner/', timestamp: Date.now() });

	return gulp
		.src(srcIndex)
		.pipe(plumber({ errorHandler: report }))
		.pipe(hbStream)
		.pipe(include({ basepath: svgPath }))
		.pipe(
			replace(
				'<!-- boilerplate.css -->',
				`
	<link rel="stylesheet" href="critical.css" />
	<link rel="stylesheet" href="bundle.css" />
		`
			)
		)
		.pipe(replace('<link rel=\'stylesheet\' href=\'bundle.css\' />', ''))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('boilerplate'));
});

gulp.task('html-style-guide', () => {
	const hbStream = hb()
		.partials('./src/html/partials/**/*.hbs')
		// .helpers('./src/html/helpers/*.js')
		.data('./template-data/**/*.{js,json}')
		.data({ basepath: 'https://github.com/krwarner/', timestamp: Date.now() });

	return gulp
		.src('./src/html/style-guide.hbs')
		.pipe(plumber({ errorHandler: report }))
		.pipe(hbStream)
		.pipe(include({ basepath: svgPath }))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('docs'));
});
