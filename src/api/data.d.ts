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
