import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useState } from 'react';

interface Props {
	children: ReactNode;
}

interface SettingsOverlayInterface {
	settingsModalOpen: boolean;
	setSettingsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingsOverlayContext = createContext<SettingsOverlayInterface | null>(
	null,
);

const SettingsOverlayProvider = ({ children }: Props) => {
	const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

	return (
		<SettingsOverlayContext.Provider
			value={{ settingsModalOpen, setSettingsModalOpen }}
		>
			{children}
		</SettingsOverlayContext.Provider>
	);
};

export {
	SettingsOverlayProvider,
	SettingsOverlayContext,
	SettingsOverlayInterface,
};
