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
  [key: string]: string | object | number;
}
export interface IQuery {
  type?: string | null;
  keyWord: string | null;
  startDate?: string;
  endDate?: string;
}
export interface IODetialData extends IOLogData {
  count: number;
  remark: string | null;
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
export interface IPmcTagManageForm {
  cid: string;
  cname: string;
  currentTags: Array<number>;
  initalTags: Array<number>;
  [key: string]: string | Array<number>;
}

export interface IStaffQuery {
  queryType: string | null;
  keyWord: string | null;
  [key: string]: string | null;
}

export interface IStaffTableData {
  uid: string;
  wno: string;
  usrName: string;
  sex: string;
  usrType: string;
  warehouseName: string;
  phone: string;
  [key: string]: string;
}
export interface IStaffInfo {
  usrName: string | null;
  wno: string | null;
  sex: string | null;
  phone: string | null;
  usrType: string | null;
  [key: string]: string | null;
}
export interface IAllocForm {
  uid: string | null;
  currentHid: string | null;
  currentHouseName: string | null;
  hid: string | null;
  usrName: string | null;
  wno: string | null;
  isPrincipal: boolean | null;
  [key: string]: string | boolean | null;
}

// sapwmDetial-trading
export interface ITradingForm {
  cid: string | null;
  isPop: number | null;
  handler: string | null;
  quantity: number | null;
  remark: string | null;
  [key: string]: string | number | null;
}
