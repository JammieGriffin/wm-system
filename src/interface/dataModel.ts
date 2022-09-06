export interface IOdata{
  in:number;
  out:number;
  date:string;
}
export interface IOLogData{
  host:string;
  name:string;
  status:string;
  time:string;
  principal:string;
}
export interface IRoseDiagramData{
  name:string;
  value:number;
}
export interface IWarehouseInfo{
  id:string;
  name:string;
  status:{
    value:string;
    label:string;
  };
  type:string;
  capacity:number;
}