import { palette } from '@guardian/pasteup/palette'

/*
Roles for colors.  Prefer using these over the palette.  It makes it easier
to change things. Also it makes night mode possible so there's that.

The only roles we need to place in here are the ones that span through the app.
If you have a specific use-case, like a spinner color.  It makes more sense to
put that in the <Spinner /> component.
*/

export const color = {
    /*
    Backgrounds
    */
    background: palette.neutral[100],
    text: palette.neutral[7],
    dimBackground: palette.neutral[93],
    dimText: palette.neutral[20],
    darkBackground: palette.neutral[20],
    photoBackground: palette.neutral[7],
    textOverPhotoBackground: palette.neutral[100],
    textOverDarkBackground: palette.neutral[100],
    artboardBackground: palette.neutral[7],
    skeleton: palette.neutral[60],

    /*
    Brand (our blue)
    */
    textOverPrimary: palette.neutral[100],
    primary: palette.brand.main,
    primaryDarker: palette.brand.dark,

    /*
    Border colors
    */
    line: palette.neutral[60],
    dimLine: palette.neutral[85],
    lineOverPrimary: palette.brand.pastel,

    /*
    Error messages and icons.
    */
    error: palette.news.main,

    /*
    Onboarding & button UI.
    */
    ui: {
        tomato: palette.news.bright,
        apricot: palette.opinion.bright,
        shark: palette.sport.main,
        sea: '#279DDC',
        supportBlue: '#41A9E0',
    },

    /*
    The palette is available to use, but prefer using the name.
    */
    palette,
}
