export enum VersionCreateVersionType {
    MINOR = "minor",
    MAJOR = "major",
}

export interface IVersionCreateVersion {
    type: VersionCreateVersionType;
    comment: string;
    file: File;
}
