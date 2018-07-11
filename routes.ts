
export interface Crumb {
	readonly href: string;
	readonly title: string;
}

export type GenericParamsWithRouteName<
	TRouteName,
	TParams extends {}
> = TParams & {
	readonly routeName: TRouteName;
};

export type UntypedParams = { readonly [key: string]: string };

interface Url<TRouteName, TParams, KOptional extends keyof TParams, TAdditionalData> {
	readonly make: (params: OptionalProps<TParams, KOptional>) => string;
	readonly route: string;
	readonly parse: (
		params: UntypedParams,
	) => GenericParamsWithRouteName<TRouteName, TParams>;
	readonly crumb: (
		params: OptionalProps<TParams, KOptional>,
		additionalData: TAdditionalData,
	) => ReadonlyArray<Crumb>;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type OptionalProps<T, KOptional extends keyof T> = Omit<T, KOptional> &
	Partial<Pick<T, KOptional>>;

export function makeUrl<
	TRouteName extends string,
	TParams extends {},
	KOptional extends keyof TParams,
	TAdditionalData
>(
	routeName: TRouteName,
	url: {
		readonly make: (params: OptionalProps<TParams, KOptional>) => string;
		readonly route: string;
		readonly parse: (untypedParams: UntypedParams) => TParams;
		readonly previousCrumb?: (
			params: OptionalProps<TParams, KOptional>,
			additionalData: TAdditionalData,
		) => ReadonlyArray<Crumb>;
		readonly crumbTitle: (
			params: OptionalProps<TParams, KOptional>,
			additionalData: TAdditionalData,
		) => string;
	},
): Url<TRouteName, TParams, KOptional, TAdditionalData> {
	return {
		make: url.make,
		route: url.route,
		parse: (untypedParams: UntypedParams) =>
			Object.assign(url.parse(untypedParams), {
				routeName,
			}) as GenericParamsWithRouteName<TRouteName, TParams>,
		crumb: (params, additionalData) => [
			...(url.previousCrumb ? url.previousCrumb(params, additionalData) : []),
			{ title: url.crumbTitle(params, additionalData), href: url.make(params) },
		],
	};
}
