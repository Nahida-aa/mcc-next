'server-only';
import { db } from './index';
import { user as usersTable, identity, idCardInfo as idCardInfoTable, home  } from './schema/user';
import { linkUserFollow, linkGroupFollow, linkUserProj, linkUserResource, linkUserGroup, linkUserIdentity } from './schema/link';
import { proj } from './schema/proj';
import { resource } from './schema/resource';
import { tag } from './schema/tag';
import * as qUser from "./q/qUser"
import { QLinkUserFollow } from './q/qUserFollow';
import { console } from 'inspector';

export async function dropAllTables() {
  const tables = [
    'Group',
    'LinkGroupFollow',
    'LinkGroupIdentity',
    'LinkGroupProj',
    'LinkGroupResource',
    'LinkUserFollow',
    'LinkUserGroup',
    'LinkUserIdentity',
    'LinkUserProj',
    'LinkUserResource',
    'Proj',
    'Resource',
    'Tag',
    'Home',
    'IDCardInfo',
    'Identity',
    'User'
  ];

  for (const table of tables) {
    await db.execute(`DROP TABLE IF EXISTS "${table}" CASCADE`);
  }
}
async function createUserLines() {
  // 初始创建三个用户
  const user1 = await qUser.create({
    name: 'test1',
    password: 'string',
    image: 'https://avatars.githubusercontent.com/u/96083926?s=80&v=4',
    idCardInfo: {
      idCardNumber: 'string123456',
    },
  });
  console.log('user1:', user1);
  console.log('user1.idCardInfo:', user1.idCardInfo);
  const user2 = await qUser.create({
    name: 'test2',
    password: '123456',
    image: 'https://avatars.githubusercontent.com/u/96083926?s=80&v=4',
    idCardInfo: {
      idCardNumber: '123456123456',
    },
  });
  console.log('user2:', user2);
  const user3 = await qUser.create({
    name: '测试用户',
    password: '1234ts',
    image: 'https://avatars.githubusercontent.com/u/96083926?s=80&v=4',
    idCardInfo: {
      idCardNumber: '1234ts123456',
    },
  });
  console.log('user3:', user3);
}

async function followUserTest(){
  // const result = await QLinkUserFollow.followUserByNames('test1', 'test2');
  // console.log('followUserByNames:', result);
  const result2 = await QLinkUserFollow.followUserByNames('测试用户', 'test2');
  console.log('followUserByNames:', result2);
  const result3 = await QLinkUserFollow.followUserByNames('test1', '测试用户');
  console.log('followUserByNames:', result3);
}

async function main() {
  // await dropAllTables();
  // await createUserLines();
  await followUserTest();
}

main().catch(console.error);