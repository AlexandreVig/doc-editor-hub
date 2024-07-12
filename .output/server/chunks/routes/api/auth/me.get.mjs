import { d as defineEventHandler } from '../../../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'bcrypt';

const me_get = defineEventHandler(async (event) => {
  return event.context.user;
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
