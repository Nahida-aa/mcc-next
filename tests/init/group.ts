// 0.or_1 list friend
// 1. new group
import { CreateGroupReq } from "@/server/routes/groups/create";
import { localhostV0, session_token } from "./user";
import { db } from "@/server/apps/admin/db";
import { link_chat_user_table } from "@/db/schema/message";

const listFriend = async () => {
  const res = await fetch(`${localhostV0}/user/list/is_friend`, {
    headers: {
      "Cookie": `session_token=${session_token}`
    }
  })
  console.log(res)
  const resBody = await res.json()
  console.log(JSON.stringify(resBody, null, 2))
}

const createGroupReqBody: CreateGroupReq = {
  name: "test-group",
  members: [{
    id: "66fb4ddd-c902-4d4c-a37c-bcaf5d8fb725",
    name: "test1",
  },{
    id: "6440d622-44c8-41e4-a5a5-6f05773349c0",
    name: "test2",
  }]
}
const createGroup = async () => {
  const res = await fetch(`${localhostV0}/groups`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Cookie": `session_token=${session_token}`
    },
    body: JSON.stringify(createGroupReqBody)
  })
  console.log(res)
  const resBody = await res.json()
  console.log(resBody)
}


if (require.main === module) {
  // await listFriend();
  // await createGroup();
}