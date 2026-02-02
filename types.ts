
export interface RowData {
  rowIndex: number;
  codice: string;
  linkFoto: string;
  nomeOperatore?: string;
  stato: 'NUOVO' | 'CONTROLLATO' | 'DUPLICATO' | string;
  isDuplicate?: boolean;
  data?: string;
  ora?: string;
  [key: string]: any;
}

export interface ApiResponse {
  status: 'success' | 'error';
  data?: RowData[];
  message?: string;
}