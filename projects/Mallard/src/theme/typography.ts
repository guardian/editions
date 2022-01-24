import { Dimensions } from 'react-native';
import type { BreakpointList } from 'src/theme/breakpoints';
import { Breakpoints, pickClosestBreakpoint } from './breakpoints';

export const families = {
	icon: {
		regular: 'GuardianIcons-Regular',
	},
	sans: {
		regular: 'GuardianTextSans-Regular',
		regularItalic: 'GuardianTextSans-RegularIt',
		bold: 'GuardianTextSans-Bold',
	},
	text: {
		regular: 'GuardianTextEgyptian-Reg',
		regularItalic: 'GuardianTextEgyptian-RegIt',
		bold: 'GuardianTextEgyptian-Bold',
	},
	titlepiece: {
		regular: 'GTGuardianTitlepiece-Bold',
	},
	daily: {
		regular: 'GTGuardianDaily-Regular',
	},
	headline: {
		light: 'GHGuardianHeadline-Light',
		regular: 'GHGuardianHeadline-Regular',
		medium: 'GHGuardianHeadline-Medium',
		bold: 'GHGuardianHeadline-Bold',
	},
};

type FontFamily = keyof typeof families;

/*
Think of these as ems
*/

const scale = {
	icon: {
		[1]: {
			[Breakpoints.SmallPhone]: {
				fontSize: 20,
				lineHeight: 20,
			},
			[Breakpoints.Phone]: {
				fontSize: 20,
				lineHeight: 20,
			},
		},
	},
	sans: {
		[0.5]: {
			[Breakpoints.SmallPhone]: {
				fontSize: 11,
				lineHeight: 11,
			},
			[Breakpoints.Phone]: {
				fontSize: 13,
				lineHeight: 13,
			},
		},
		[0.9]: {
			[Breakpoints.SmallPhone]: {
				fontSize: 13,
				lineHeight: 16,
			},
			[Breakpoints.Phone]: {
				fontSize: 15,
				lineHeight: 18,
			},
		},
		1: {
			[Breakpoints.SmallPhone]: {
				fontSize: 14,
				lineHeight: 19,
			},
			[Breakpoints.Phone]: {
				fontSize: 17,
				lineHeight: 21,
			},
		},
		1.5: {
			[Breakpoints.SmallPhone]: {
				fontSize: 15,
				lineHeight: 22,
			},
			[Breakpoints.Phone]: {
				fontSize: 20,
				lineHeight: 23,
			},
		},
	},
	text: {
		0.9: {
			[Breakpoints.SmallPhone]: {
				fontSize: 14,
				lineHeight: 15,
			},
			[Breakpoints.Phone]: {
				fontSize: 15,
				lineHeight: 17,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 17,
				lineHeight: 19.5,
			},
		},
		1: {
			[Breakpoints.SmallPhone]: {
				fontSize: 14,
				lineHeight: 18,
			},
			[Breakpoints.Phone]: {
				fontSize: 18,
				lineHeight: 23,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 18,
				lineHeight: 22,
			},
		},
		1.25: {
			[Breakpoints.SmallPhone]: {
				fontSize: 15,
				lineHeight: 19,
			},
			[Breakpoints.Phone]: {
				fontSize: 18,
				lineHeight: 22,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 20,
				lineHeight: 24,
			},
		},
	},
	headline: {
		0.5: {
			[Breakpoints.SmallPhone]: {
				fontSize: 12,
				lineHeight: 14,
			},
			[Breakpoints.Phone]: {
				fontSize: 12,
				lineHeight: 14,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 16,
				lineHeight: 17,
			},
		},
		0.75: {
			[Breakpoints.SmallPhone]: {
				fontSize: 18,
				lineHeight: 20,
			},
			[Breakpoints.Phone]: {
				fontSize: 18,
				lineHeight: 20,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 21,
				lineHeight: 22,
			},
		},
		// this block defies the design system - size 22 isn't a thing normally but we need it
		0.9: {
			[Breakpoints.SmallPhone]: {
				fontSize: 18,
				lineHeight: 20,
			},
			[Breakpoints.Phone]: {
				fontSize: 18,
				lineHeight: 20,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 22,
				lineHeight: 25,
			},
		},
		1: {
			[Breakpoints.SmallPhone]: {
				fontSize: 15,
				lineHeight: 17,
			},
			[Breakpoints.Phone]: {
				fontSize: 17,
				lineHeight: 20,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 24,
				lineHeight: 27,
			},
		},
		1.2: {
			[Breakpoints.SmallPhone]: {
				fontSize: 20,
				lineHeight: 22,
			},
			[Breakpoints.Phone]: {
				fontSize: 24,
				lineHeight: 26,
			},
		},
		1.25: {
			[Breakpoints.SmallPhone]: {
				fontSize: 20,
				lineHeight: 23,
			},
			[Breakpoints.Phone]: {
				fontSize: 24,
				lineHeight: 26,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 28,
				lineHeight: 30,
			},
		},
		1.5: {
			[Breakpoints.SmallPhone]: {
				fontSize: 20,
				lineHeight: 22,
			},
			[Breakpoints.Phone]: {
				fontSize: 24,
				lineHeight: 26,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 36,
				lineHeight: 38,
			},
		},
		1.6: {
			[Breakpoints.SmallPhone]: {
				fontSize: 21,
				lineHeight: 22,
			},
			[Breakpoints.Phone]: {
				fontSize: 29,
				lineHeight: 32,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 36,
				lineHeight: 38,
			},
		},
		1.75: {
			[Breakpoints.SmallPhone]: {
				fontSize: 30,
				lineHeight: 32,
			},
			[Breakpoints.Phone]: {
				fontSize: 32,
				lineHeight: 34,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 40,
				lineHeight: 44,
			},
		},
		2: {
			[Breakpoints.SmallPhone]: {
				fontSize: 40,
				lineHeight: 44,
			},
			[Breakpoints.Phone]: {
				fontSize: 40,
				lineHeight: 44,
			},
		},
		// currently only used by journal cards. not in design system
		2.5: {
			[Breakpoints.SmallPhone]: {
				fontSize: 32,
				lineHeight: 37,
			},
			[Breakpoints.Phone]: {
				fontSize: 32,
				lineHeight: 37,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 50,
				lineHeight: 58,
			},
		},
	},
	titlepiece: {
		1: {
			[Breakpoints.SmallPhone]: {
				fontSize: 16,
				lineHeight: 18,
			},
			[Breakpoints.Phone]: {
				fontSize: 16,
				lineHeight: 18,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 18,
				lineHeight: 20,
			},
		},
		// 1.1 is NOT in the design system - for use only in SliderTitle
		1.1: {
			[Breakpoints.SmallPhone]: {
				fontSize: 18,
				lineHeight: 20,
			},
			[Breakpoints.Phone]: {
				fontSize: 20,
				lineHeight: 22,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 30,
				lineHeight: 33,
			},
		},
		1.25: {
			[Breakpoints.SmallPhone]: {
				fontSize: 20,
				lineHeight: 22,
			},
			[Breakpoints.Phone]: {
				fontSize: 24,
				lineHeight: 26,
			},
		},
		// 1.4 is NOT in the design system - for use only in SliderTitle
		1.4: {
			[Breakpoints.SmallPhone]: {
				fontSize: 24,
				lineHeight: 26,
			},
			[Breakpoints.Phone]: {
				fontSize: 28,
				lineHeight: 32,
			},
			[Breakpoints.TabletVertical]: {
				fontSize: 38,
				lineHeight: 42,
			},
		},
		1.5: {
			[Breakpoints.SmallPhone]: {
				fontSize: 25,
				lineHeight: 28,
			},
			[Breakpoints.Phone]: {
				fontSize: 30,
				lineHeight: 33,
			},
		},
		2: {
			[Breakpoints.SmallPhone]: {
				fontSize: 38,
				lineHeight: 43,
			},
			[Breakpoints.Phone]: {
				fontSize: 45,
				lineHeight: 50,
			},
		},
		2.25: {
			[Breakpoints.SmallPhone]: {
				fontSize: 38,
				lineHeight: 42,
			},
			[Breakpoints.Phone]: {
				fontSize: 50,
				lineHeight: 55,
			},
		},
		2.5: {
			[Breakpoints.SmallPhone]: {
				fontSize: 50,
				lineHeight: 56,
			},
			[Breakpoints.Phone]: {
				fontSize: 60,
				lineHeight: 58,
			},
		},
	},
	daily: {
		1: {
			[Breakpoints.Phone]: {
				fontSize: 20,
				lineHeight: 25,
			},
		},
	},
};

export type FontSizes<F extends FontFamily> = keyof typeof scale[F];
type FontWeights<F extends FontFamily> = keyof typeof families[F];

export const getUnscaledFont = <F extends FontFamily>(
	family: F,
	level: FontSizes<F>,
) => {
	return scale[family][level] as unknown as BreakpointList<{
		fontSize: number;
		lineHeight: number;
	}>;
};

export const applyScale = (
	unscaledFont: ReturnType<typeof getUnscaledFont>,
) => {
	return pickClosestBreakpoint(
		unscaledFont,
		Dimensions.get('window').width * 1,
	);
};

export const getFont = <F extends FontFamily>(
	family: F,
	level: FontSizes<F>,
	weight: FontWeights<F> = 'regular',
) => {
	const fontAtLevel = getUnscaledFont(family, level);
	return {
		fontFamily: families[family][weight],
		...applyScale(fontAtLevel),
	};
};
