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
    htid:number;
    typeName:string;
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
  keyWord: string;
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
  cid:string;
  cargoName:string;
  tags:Array<{ctid:number,typeName:string}>;
  quantity?:number;
}
export interface IPmcTableQuery extends IQuery{
  ctid:number;
}