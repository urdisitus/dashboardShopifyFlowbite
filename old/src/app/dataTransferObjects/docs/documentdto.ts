export interface IDocumentVersionDto {
  sNoCia?: string;
  nDocumentId?: number;
  sExtCode?: string;
  nDocumentTypeId?: number;
  sDocumentType?: string;
  sInfoExtra?: string;
  sSourceDir?: string;
  sVersionName?: string;
  sHashMd5?: string;
  sHashSha1?: string;
  sMimeType?: string;
  sExtension?: string;
  sUserDomain?: string;
  sCreateUserId?: string;
  sEditUserId?: string;
  bLastVersion?: boolean;
  nState?: number;
  dCreateDate?: string;
  dEditDate?: string;
}
