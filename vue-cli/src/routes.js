import User from "./components/user";
import Home from "./components/Home";
import Cate from "./components/cate";

export const routes = [
  { path: "/", component: Home },
  { path: "/user", component: User},
  { path: "/cate", component: Cate}
];
