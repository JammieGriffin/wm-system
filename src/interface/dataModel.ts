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
  hsid:number;
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
  otherType?: string;
};
export interface IHouseDetialInfo {
  houseName: string;
  houseId: string;
  houseAddr: string;
  houseType: string;
  capacity: number;
  status: {
    label: string;
    value: string;
  };
  houseArea: number;
  houseAdmin: string;
  houseStaff: Array<string>;
}
export interface IQuery {
  type: string | null;
  keyWord: string;
  startDate: string;
  endDate: string;
}
export interface IODetialData extends IOLogData {
  logID: string;
  count: number;
  remark: string;
}
