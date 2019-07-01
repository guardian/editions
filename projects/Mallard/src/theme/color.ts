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
    dimBackground: palette.neutral[97],
    darkBackground: palette.neutral[20],
    textOverDarkBackground: palette.neutral[100],

    /*
    Brand (our blue)
    */
    textOverPrimary: palette.neutral[100],
    primary: palette.brand.main,
    primaryDarker: palette.brand.dark,

    /*
    Border colors
    */
    line: palette.neutral[86],
    lineOverPrimary: palette.brand.pastel,

    /*
    Text colors
    */
    text: palette.neutral[7],
    dimText: palette.neutral[20],

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
    },

    /*
    The palette is available to use, but prefer using the name.
    */
    palette,
}
