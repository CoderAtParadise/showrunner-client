export interface IFetcher<T> {
    readonly id: string;
    readonly fetch: (show: string, session: string) => Promise<T>;
}
