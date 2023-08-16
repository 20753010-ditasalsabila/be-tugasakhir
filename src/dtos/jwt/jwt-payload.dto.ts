import User from './jwt-user.dto';
import Role from './jwt-role.dto';
import Menu from './jwt-menu.dto';
import Service from './jwt-service.dto';

export default class JwtPayload {
  user: User;
  roles?: Role[];
  menus?: Menu[];
  services: Service[];
}
