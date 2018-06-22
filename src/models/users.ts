export interface User {
    cell: string;
    name: {
        first: string;
        last: string;
        title: string;
    };
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    } | null;
}

export enum LoadingStatus {
    Initial,
    Loading,
    Success,
    Failed
}
