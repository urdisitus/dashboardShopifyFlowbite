export interface IRedeemPointDto {
    id?: number;
    name?: string;
    descript?: string;
    startDate?: string;
    endDate?: string;
    startDateD?: Date;
    endDateD?: Date;
    factor?: number;
    value?: number;
    minimalAmonunt?: number;
    redeemPointGroupId?: string;
    redeemPointTypeId?: string;
    redeemPointGroupName?: string;
    redeemPointTypeName?: string;
}

export interface IStoreRedeemPointParam {
    id?: number;
    name?: string;
    descript?: string;
    startDate?: string;
    endDate?: string;    
    factor?: number;
    value?: number;
    minimalAmonunt?: number;
    redeemPointGroupId?: string;
    redeemPointTypeId?: string;
    userId?: string;
}

export interface IRedeemPointTypeDto {
    id?: string;
    name?: string;
    descript?: string;
}

export interface IRedeemPointGroupDto {
    id?: string;
    name?: string;
    descript?: string;
}

export interface IRedeemPointFilterParam {
    status?: number,
    criteria?: number,
    startDate?: string,
    endDate?: string
}