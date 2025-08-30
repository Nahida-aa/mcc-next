// 'server-only';
// import 'dotenv/config';
// import { db } from './index'; // 使用共享的数据库连接

// console.log('Database initialization file - currently disabled to prevent connection issues');

// // 临时注释掉所有初始化代码，避免连接问题和过时的导入
// // 如果需要数据库初始化功能，请使用最新的 schema 重新编写

// /*
// // 这里是被注释掉的原有代码，包含过时的 schema 导入
// // 如果需要重新启用，请先更新所有导入路径以匹配当前的 schema 结构
// async function createUserLines() {
//   // ... 用户创建逻辑 ...
// }

// async function followUserTest() {
//   // ... 关注测试逻辑 ...
// }

// async function main() {
//   // await createUserLines();
//   // await followUserTest();
// }

// // main().catch(console.error);
// */
//     {
//       name: "test1",
//       password: "string",
//       phone: "124567890",
//       id_card_info: {
//         id_card_number: "124567890"
//       }
//     },{
//       name: "test2",
//       password: "string",
//       image: 'https://avatars.githubusercontent.com/u/96083926?s=80&v=4',
//       phone: "124567890",
//       id_card_info: {
//         id_card_number: "124567890"
//       }
//     },{
//       name: "测试用户",
//       password: "string",
//       image: 'https://avatars.githubusercontent.com/u/188596056?v=4',
//       phone: "124567890",
//       id_card_info: {
//         id_card_number: "124567890"
//       }
//     }
//   ]
//   // const res = await fetch("/api/hono/auth/register", {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //   },
//   //   body: JSON.stringify(testUsers[0]),
//   // });
//   // 初始创建三个用户
//   const user1 = await qUser.create({
//     name: 'test1',
//     password: 'string',
//     image: 'https://avatars.githubusercontent.com/u/96083926?s=80&v=4',
//     idCardInfo: {
//       id_card_number: 'string123456',
//     },
//   });
//   console.log('user1:', user1);
//   console.log('user1.idCardInfo:', user1.idCardInfo);
//   const user2 = await qUser.create({
//     name: 'test2',
//     password: '123456',
//     image: 'https://avatars.githubusercontent.com/u/96083926?s=80&v=4',
//     idCardInfo: {
//       id_card_number: '123456123456',
//     },
//   });
//   console.log('user2:', user2);
//   const user3 = await qUser.create({
//     name: '测试用户',
//     password: '1234ts',
//     image: 'https://avatars.githubusercontent.com/u/188596056?v=4',
//     idCardInfo: {
//       id_card_number: '1234ts123456',
//     },
//   });
//   console.log('user3:', user3);
// }

// async function followUserTest(){
//   // const result = await QLinkUserFollow.followUserByNames('test1', 'test2');
//   // console.log('followUserByNames:', result);
//   // const result2 = await QLinkUserFollow.followUserByNames('测试用户', 'test2');
//   // console.log('followUserByNames:', result2);
//   // const result3 = await QLinkUserFollow.followUserByNames('test1', '测试用户');
//   // console.log('followUserByNames:', result3);
// }

// async function main() {
//   // await dropAllTables();
//   // await createUserLines();
//   await followUserTest();
// }

// main().catch(console.error);