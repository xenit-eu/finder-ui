export enum VersionPanelCreateVersionType {
    MINOR = "minor",
    MAJOR = "major",
}

export interface IVersionPanelCreateVersion {
    type: VersionPanelCreateVersionType;
    comment: string;
    file: File;
}
