export interface ILoyaltyCampaignDto {
    id?: number;
    name?: string;
    descript?: string;
    startDate?: string;
    endDate?: string;
    startDateD?: Date;
    endDateD?: Date;
    factor?: number;
    loyaltyCampaignRule?: ILoyaltyCampaignRuleDto[];
}

export interface IStoreLoyaltyCampaignParam {
    id?: number;
    name?: string;
    descript?: string;
    startDate?: string;
    endDate?: string;    
    factor?: number;
    userId?: string;
    loyaltyCampaignRule?: IStoreLoyaltyCampaignRuleParam[];
}

export interface IStoreLoyaltyCampaignRuleParam {
    loyaltyCampaignRuleTypeId?: string;    
    value?: string;
    extCodeValue?: string;
    descript?: string;
}

export interface ILoyaltyCampaignRuleDto {
    id?: string;
    loyaltyCampaignRuleTypeId?: string;
    loyaltyCampaignRuleTypeName?: string;
    value?: string;
    extCodeValue?: string;
    descript?: string;
}

export interface ILoyaltyCampaignRuleTypeDto {
    id?: string;
    name?: string;
    descript?: string;
}

export interface ILoyaltyCampaignFilterParam {
    status?: number,
    criteria?: number,
    startDate?: string,
    endDate?: string
}