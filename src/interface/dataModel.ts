import { IMember } from "../api/data";

export interface IOdata {
  in: number;
  out: number;
  date: string;
}
export interface IOLogData {
  host: string;
  name: string;
  status: string;
  time: string;
  principal: string;
}
export interface IBaseChartData {
  name: string;
  value: number;
}
export interface IWarehouseInfo {
  id: string;
  name: string;
  hsid: number;
  status: {
    value: string;
    label: string;
  };
  type: string;
  houseArea: number;
  capacity: number;
}

export type IRenameForm = {
  houseId: string;
  houseOldName: string;
  houseNewName: string;
};
export type INewHouseForm = {
  houseName: string;
  houseType: number | null;
  houseArea: number;
  capacity: number;
  otherType?: string | null;
};
export interface IHouseDetialInfo {
  houseName: string;
  houseId: string;
  houseAddr: string;
  houseType: {
    htid: number;
    typeName: string;
  };
  capacity: number;
  status: {
    hsid: number;
    label: string;
    value: string;
  };
  houseArea: number;
  houseAdmin: IMember;
  houseStaff: Array<IMember>;
}
export interface IQuery {
  type?: string | null;
  keyWord: string | null;
  startDate?: string;
  endDate?: string;
}
export interface IODetialData extends IOLogData {
  logID: string;
  count: number;
  remark: string;
}

//pmc
export interface IPmcTableData {
  cid: string;
  cargoName: string;
  tags: Array<{ ctid: number; typeName: string }>;
  quantity?: number;
}
export interface IPmcTableQuery extends IQuery {
  ctid: number | null;
}

export interface IPmcForm {
  cname: string | null;
  tags: Array<number> | null;
  [key: string]: string | Array<number> | null;
}
export interface IPmcFormOption {
  ctid: number;
  typeName: string;
}
export interface IPmcTagManageForm{
  cid:string;
  cname:string;
  currentTags:Array<number>;
  initalTags:Array<number>;
  [key:string]:string | Array<number>
}

export interface IStaffQuery extends IQuery{
  queryType:string | null;
}

export interface IStaffTableData {
  uid:string;
  wno:string;
  usrName:string;
  sex:string;
  usrType:string;
  warehouseName:string;
  
}
