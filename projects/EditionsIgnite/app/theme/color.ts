import { palette } from "@guardian/pasteup/palette"

/**
 * Roles for colors.  Prefer using these over the palette.  It makes it easier
 * to change things.
 *
 * The only roles we need to place in here are the ones that span through the app.
 *
 * If you have a specific use-case, like a spinner color.  It makes more sense to
 * put that in the <Spinner /> component.
 */
export const color = {
  /**
   * The palette is available to use, but prefer using the name.
   */
  palette,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * backgrounds.
   */
  background: palette.neutral[100],
  darkBackground: palette.neutral[20],
  textOverDarkBackground: palette.neutral[100],
  /**
   * Brand (our blue)
   */
  textOverPrimary: palette.neutral[100],
  primary: palette.brand.main,
  primaryDarker: palette.brand.dark,
  /**
   * A subtle color used for borders and lines.
   */
  line: palette.neutral[86],
  /**
   * The default color of text in many components.
   */
  text: palette.neutral[7],
  /**
   * Secondary information.
   */
  dim: palette.neutral[20],

  /**
   * Error messages and icons.
   */
  error: palette.news.main,

  /**
   * Storybook background for Text stories, or any stories where
   * the text color is color.text, which is white by default, and does not show
   * in Stories against the default white background
   */
  storybookDarkBg: palette.neutral[7],

  /**
   * Storybook text color for stories that display Text components against the
   * white background
   */
  storybookTextColor: palette.neutral[100],
}
