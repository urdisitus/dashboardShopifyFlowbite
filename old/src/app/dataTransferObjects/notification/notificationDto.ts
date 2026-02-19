export interface NotificationDto {
  name?: string;
  segmentId?: string;
  segmentName?: string;
  segmentQuery?: string;
  title?: string;
  message?: string;
  contentTypeId?: string;
  contentCode?: string;
  status?: number;
  createDate?: string;
  editDate?: string;
  createUser?: string;
  editUser?: string;
  id?: number;
  osTypes? : string[];
  tmpOsTypes? : string;
}

export interface NotificationParam {
  name?: string;
  segmentId?: string;
  segmentName?: string;
  segmentQuery?: string;
  title?: string;
  message?: string;
  contentTypeId?: string;
  contentCode?: string;
  user?: string;
  id?: number;
  osTypes?: string[];
}

export interface FilterNotification {
  criteria?: string;
  segmentName?: string[];
  contentType?: string[];
  status?: number[];
  pageSize: number;
  pageIndex: number;
}

export interface FilterHistory {
  camapaignId?: number;
  startDate?: string;
  endDate?: string;
  criteria?: string;
  segmentName?: string[];
  contentType?: string[];
  pageSize: number;
  pageIndex: number;
}

export interface HistoryItem {
  uniqueCode?: string
  campaignId?: number
  sendDate?: string
  sendUser?: string
  jobId?: string
  name?: string
  segmentId?: string
  segmentName?: string
  segmentQuery?: string
  title?: string
  message?: string
  contentTypeId?: string
  contentCode?: any
  id?: number
}



export interface CampaignContentType {
  name?: string;
  descript?: string;
  id?: string;
}

export interface CampaignSegment {
  id?: string;
  idLegacy?: string;
  name?: string;
  query?: string;
}

export interface PaginateCampaignSegment {
  data?: CampaignSegment[];
  nextPageInfo?: any;
  prevPageInfo?: any;
}

export interface SendNotificationParam {
  campaignId: number
  sendUser: string
  name: string
  segmentId: string
  segmentName: string
  segmentQuery: string
  title: string
  message: string
  contentTypeId: string
  contentCode: string,
  osTypes: string[]
}

export interface DetailFilter {
  app?: string
  campaignGroupId?: string
  userId?: string[]
  index?: number
  size?: number
}



export interface DetailsNotification {
  _id?: string
  app?: string
  campaignGroupId?: string
  title?: string
  body?: string
  additionalData?: DetailsAdditionalData
  pushId?: string
  userId?: string
  osType?: string
  version?: string
  email?: string
  phone?: string
  success?: boolean
  tries?: number
  created?: Date
  lastIntent?: Date
  lastError?: Date
  sended?: Date
}

export interface DetailsAdditionalData {
  contentType?: string
  contentCode?: string
}


