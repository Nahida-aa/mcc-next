// 1. register
// 2. session
import { ReqRegisterUserBody } from "~/lib/routes/auth/register";

export const localhostV0 = 'http://localhost:3000/api/hono';
async function initTestCreateUsers() {
  const testUsers: ReqRegisterUserBody[] = [
    {
      name: "test1",
      password: "string",
      phone: "124567890",
      id_card_info: {
        id_card_number: "124567890"
      }
    },{
      name: "test2",
      password: "string",
      image: 'https://avatars.githubusercontent.com/u/96083926?s=80&v=4',
      phone: "1245678901",
      id_card_info: {
        id_card_number: "1245678901"
      }
    },{
      name: "测试用户",
      password: "string",
      image: 'https://avatars.githubusercontent.com/u/188596056?v=4',
      phone: "1245678902",
      id_card_info: {
        id_card_number: "1245678902"
      }
    }, {
      name: "test-friend",
      password: "string",
      phone: "1245678903",
      id_card_info: {
        id_card_number: "1245678903"
      }
    }
  ]
  const res = await fetch(`${localhostV0}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testUsers[3]),
  });
  console.log('res:', res);
  const resBody = await res.json();
  console.log('resBody:', resBody);
}

export const session_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYTRlM2Y3ZWUtOWJjZS00MzE3LWFjMjktOWMyZmM5OTlkMDg5IiwiZW1haWwiOm51bGwsIm5hbWUiOiJOYWhpZGEtYWEiLCJpbWFnZSI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xODg1OTYwNTY_dj00Iiwibmlja25hbWUiOm51bGx9LCJzY29wZXMiOltdLCJleHAiOjE3Mzk3ODI1NDcwMjN9.ACl4vVmE6M2xePA3Nr9LcyXyhoXyB40lay7huSo-9GY"

const testAuthSession = async () => {
  const res = await fetch(`${localhostV0}/auth/session`, {
    headers: {
      "Cookie": `session_token=${session_token}`
    }
  });
  console.log(res);
  const resBody = await res.json();
  console.log(resBody);
}

async function main() {
  // await dropAllTables();
  // await initTestCreateUsers();
  await testAuthSession();
}

if (require.main === module) {
  main().catch(console.error);
}