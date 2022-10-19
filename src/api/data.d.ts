export interface IUsr {
  uid: string;
  wno: string;
  usrType: string;
  sex: string;
  usrName: string;
  phone: string;
}

export interface INewHouse {
  name: string;
  type: number;
  area: number;
  capacity: number;
  typeName?: string | null;
}
export interface IHouseType {
  htid: number;
  typeName: string;
}
export interface IHouse {
  hid: string;
  hsid: number;
  houseArea: number;
  houseName: string;
  style: string;
  capacity: number;
  value: string;
  typeName: string;
}
export interface IMember {
  uid: string;
  usrName: string;
  usrType?: string;
  style?: string;
}

/*** pmc ***/
export interface ICargoType {
  typeName: string;
  num: number;
  ctid: number;
}

/*** staff ***/
export interface IStaff {
  uid: string;
  wno: string;
  usrType: string;
  sex: string;
  usrName: string;
  phone: string;
  hid: string | null;
  houseName: string | null;
}

/*** sapwmDetial ***/
export interface IWarehouseBSInfo {
  houseName: string | null;
  houseAddr: string | null;
  houseArea: number | null;
  houseId: string | null;
  hsid: number | null;
  htid: number | null;
  capacity: number | null;
  [key: string]: string | number | null;
}
export interface ITradingRecord {
  cname: string;
  count: number;
  hid: string;
  houseName: string;
  isPop: number;
  remark: string | null;
  time: string;
  usrName: string;
}

/*** console ***/
export interface ILatestTrading {
  date: string;
  count: number;
  isPop: number;
}
export interface ILatestTradingRecord {
  cname:string;
  count:number;
  houseName:string;
  isPop:number;
  time:string;
  usrName:string;
}

