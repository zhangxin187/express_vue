import Vue from 'vue';
import {
  Card,
  Form,
  FormItem,
  Input,
  Button,
  Row,
  Col,
  Link,
  Message
} from 'element-ui';

Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Link);

Vue.prototype.$message = Message;
