import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useMediaQuery } from '../hooks/use-screen';
import { Breakpoints } from '../theme/breakpoints';

const useAspectRatio = (path?: string) => {
	const isLandscape = useMediaQuery(
		(width) => width >= Breakpoints.TabletLandscape,
	);

	const [ratio, setRatio] = useState(isLandscape ? 2 : 1.5);

	useEffect(() => {
		let localSetRatio = setRatio;
		if (path) {
			Image.getSize(
				path,
				(w, h) => {
					localSetRatio(w / h);
				},
				() => {},
			);
		}
		return () => void (localSetRatio = () => {});
	}, [path]);

	return ratio;
};

export { useAspectRatio };
