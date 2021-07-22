import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

export interface ProviderHook<G, S> {
	getter: G;
	setter: S;
}

export const providerHook = <G, S>({ getter, setter }: ProviderHook<G, S>) => ({
	getter,
	setter,
});

export const nestProviders = (
	...providers: Array<(p: { children: ReactNode }) => JSX.Element | null>
) =>
	providers.reduce(
		(Prev, Cur) =>
			({ children }) =>
				(
					<Prev>
						<Cur>{children}</Cur>
					</Prev>
				),
		({ children }) => <>{children}</>,
	);

const useContextAsHook = <C extends unknown>(
	Context: React.Context<C | null>,
): C => {
	const ctx = useContext(Context);
	if (ctx === null) {
		console.error(Context);
		throw `Missing context provider for ${Context}`;
	}
	return ctx;
};

/*
By splitting up getters and setters we avoid
components that only set values rerendering
when the values are changed

https://kentcdodds.com/blog/how-to-optimize-your-context-value/
*/

const createProviderFromHook = <G, S>(
	hook: () => ProviderHook<G, S> | null,
) => {
	const [GetterCtx, SetterCtx] = [
		createContext<G | null>(null),
		createContext<S | null>(null),
	];

	const ProviderWithHook = ({
		getter,
		setter,
		children,
	}: ProviderHook<G, S> & {
		children: React.ReactNode;
	}) => {
		const memoizedSetter = useMemo(() => setter, []);
		return (
			<SetterCtx.Provider value={memoizedSetter}>
				<GetterCtx.Provider value={getter}>
					{children}
				</GetterCtx.Provider>
			</SetterCtx.Provider>
		);
	};

	const Provider = ({ children }: { children: React.ReactNode }) => {
		const hookVal = hook();
		if (hookVal) {
			return <ProviderWithHook {...hookVal}>{children}</ProviderWithHook>;
		}
		return null;
	};
	const useAsSetterHook = (): S => useContextAsHook(SetterCtx);
	const useAsGetterHook = (): G => useContextAsHook(GetterCtx);

	return { Provider, useAsGetterHook, useAsSetterHook };
};

export { createProviderFromHook };
