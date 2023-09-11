// Sidebar route metadata
export interface RouteUser {
  role: string,
  routes: RouteInfo[]
}
export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  image: string;
  active: string;
  class: string;
  extralink: boolean;
  submenu: RouteInfo[];
}
