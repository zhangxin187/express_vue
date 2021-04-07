export interface LoginResponse {
  data: null | LoginData;
  meta: Meta;
}
interface Meta {
  msg: string;
  status: number;
}
interface LoginData {
  role: 'normal' | 'admin';
  status: 0 | 1;
  _id: string;
  name: string;
  password: string;
  phone: string;
  createTime: string;
  token: string;
}
