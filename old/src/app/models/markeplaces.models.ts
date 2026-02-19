export class IMarketplaceCompany {
    id?: string;
    name?: string;
}

export class IMarketplaceItemMatchCode {
    id?: string;
    companyId?: string;
    code?: string;
    extCode?: string;
    status?: number;
    createUserId?: number;
    editUserId?: number;
    createUtcDate?: string;
    editUtcDate?: string;
    createUtcDateD?: Date;
    editUtcDateD?: Date;
}

export class IMarketplaceStoreItemMatchCode {
    id?: string;
    companyId?: string;
    code?: string;
    extCode?: string;
}

export class IMarketplaceItem {
    code?: string;
    name?: string;
}

export class IMarketplaceSetting{
    id?: string;
    key?: string;
    value?: string;
    status?: number;
    createUserId?: number;
    editUserId?: number;
    createUtcDate?: string;
    editUtcDate?: string;
    createUtcDateD?: Date;
    editUtcDateD?: Date;
}

export class IMarketplaceStoreSetting{
    id?: string;
    key?: string;
    value?: string;
}