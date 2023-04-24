import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGiflossy from 'imagemin-giflossy';
import imageminSvgo from 'imagemin-svgo';

export const images = () => {
    return app.gulp
        .src(app.path.src.images)
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: 'IMAGES',
                    message: 'Error: <%= error.message %>',
                })
            )
        )
        .pipe(app.plugins.newer(app.path.build.images))
        .pipe(
            app.plugins.if(
                app.isWebP,
                webp({
                    quality: 90,
                    // lossless: true,
                    // alphaQuality: 100,
                })
            )
        )
        .pipe(app.plugins.if(app.isWebP, app.gulp.dest(app.path.build.images)))
        .pipe(app.plugins.if(app.isWebP, app.gulp.src(app.path.src.images)))
        .pipe(app.plugins.if(app.isWebP, app.plugins.newer(app.path.build.images)))
        .pipe(
            imagemin(
                [
                    imageminGiflossy({
                        optimizationLevel: 3,
                        optimize: 3,
                        lossy: 2,
                    }),
                    imageminPngquant({
                        speed: 5,
                        quality: [0.6, 0.8],
                    }),
                    imageminMozjpeg({
                        progressive: true,
                        quality: 90,
                        optimizationLevel: 3,
                    }),
                    // imageminSvgo({
                    //     removeViewBox: false,
                    //     removeUnusedNS: false,
                    //     removeUselessStrokeAndFill: false,
                    //     cleanupIDs: false,
                    //     removeComments: true,
                    //     removeEmptyAttrs: true,
                    //     removeEmptyText: true,
                    //     collapseGroups: true,
                    // }),
                ],
                {
                    verbose: true,
                }
            )
        )
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.gulp.src(app.path.src.svg))
        .pipe(app.gulp.dest(app.path.build.images));
};
