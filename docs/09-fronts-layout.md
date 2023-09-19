# Editions Layout/Glossary

This doc is an attempt to make life easier for the next person to make layout changes to the fronts of the editions app. It is up to date as of July 2020, but will likely eventually go stale.

It should also be a useful reference point for non-developers looking to see what the current state of play is in the app.

## Fronts

This is a front - it's the whole thing from left to right. The name of the front is always visible. A subtitle may also be visible depending what `Collection` is visible.

<img src="https://github.com/guardian/editions/raw/main/docs/images/example-front.jpeg" width="400" alt="cover card with whitespace">

## Collections

A collection is a subsection within a Front. It might have it's own `subtitle` - see below.


<img src="https://github.com/guardian/editions/raw/main/docs/images/collection-with-subtitle.jpeg" width="400" alt="cover card with whitespace">

## Cards

Cards may have from 1 to 5 stories on them. 'Cover Cards' contain an image covering the full card, and are made in the [editions card builder](https://github.com/guardian/editions-card-builder)

<img src="https://github.com/guardian/editions/raw/main/docs/images/cover-card.jpeg" width="400" alt="cover card with whitespace">

## Layout/Sizing

### Overall max height/width

There is some flexibility in card height currently - it will vary based on the amount of text on the cards in the front (every card is the height of the tallest card). There's a maximum width/height though beyond which the card cannot grow, which currently lives in [spacing.ts](https://github.com/guardian/editions/blob/e9f0a1f8d301f8a0011111432c96a0a6b3725519/projects/Mallard/src/theme/spacing.ts#L44) - the properties are called `cardSize` and `cardSizeTablet`. Originally we aimed to have cards that were visible on a screen as small as the iPhone 5S/iPhone SE - 500px - but we're a little over at the moment.

Most cards will 'expand' to fill the space available to them so you won't see white space at the bottom (since something will be stuck to the bottom, e.g. trail text), with the exception of cover cards, as we don't crop or distort images, so if the cover card image isn't tall enough then we'll get a border at the bottom.

<img src="https://github.com/guardian/editions/raw/main/docs/images/cover-card-whitespace.jpeg" width="400" alt="cover card with whitespace">

### Images

Images on fronts normally take up the full width of the container they are in[1]. The height is set to a percentage of the height of the container they are in. These percentages are currently determined by logic in a file called [sizes.ts](https://github.com/guardian/editions/blob/main/projects/Mallard/src/components/front/items/helpers/sizes.ts).

[1] Except for this image which is 100% height but only 50% width!

<img src="https://github.com/guardian/editions/raw/main/docs/images/width-constrained-image.jpeg" width="400" alt="width constrained image">

### Text

Text is a bit more complex! Currently headline font sizes are determined in the `getFontSize` function in [text-block.ts](https://github.com/guardian/editions/blob/e9f0a1f8d301f8a0011111432c96a0a6b3725519/projects/Mallard/src/components/front/items/helpers/text-block.tsx#L38). The trail text font size (confusingly) lives in a file called [standfirst.tsx](https://github.com/guardian/editions/blob/main/projects/Mallard/src/components/front/items/helpers/standfirst.tsx#L8). The decimal numbers you see in these files correspond to values set in [typography.ts](https://github.com/guardian/editions/blob/main/projects/Mallard/src/theme/typography.ts)

