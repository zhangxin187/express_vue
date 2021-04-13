export interface ResponseData {
  data: null | LoginData | UserData | UserData[];
  meta: Meta;
}
interface Meta {
  msg: string;
  status: number;
}
export interface LoginData {
  role: 'normal' | 'admin';
  status: 0 | 1;
  _id: string;
  name: string;
  password: string;
  phone: string;
  createTime: string;
  token: string;
}
export interface UserData {
  role: 'normal' | 'admin';
  status: 0 | 1;
  _id: string;
  name: string;
  password?: string;
  phone: string;
  createTime?: string;
}
