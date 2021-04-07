// 定义接口,对validate第二个参数详细约束  
export interface ErrorMessage {
  username?:InvalidFields[],
  password?:InvalidFields[],
  //索引签名(任意属性)
  [propName:string]:any; //对象数组 
}
interface InvalidFields {
  message:string,
  field:string
}
