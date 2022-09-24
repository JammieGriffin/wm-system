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
  typeName?: string;
}
export interface IHouseType {
  htid: number;
  value: string;
}
export interface IHouse {
  hid: string;
  hsid:number;
  houseArea: number;
  houseName:string;
  style:string;
  capacity:number;
  value:string;
  typeName:string;
}
