// 1. list user
// 2. add friend send request
// 3. 列出好友通知
// 4. 接受好友请求

import { OffsetLimitQuery_withQ } from "@/lib/schema/query";
import { localhostV0, session_token } from "./user";
import { AddFriendSendRequest } from "@/lib/routes/friend/add";

const listUserNotFriendReqQuery: OffsetLimitQuery_withQ = {q: "test"}

const fetchListUserNotFriend = async () => {
  const queryParams = {
    q: listUserNotFriendReqQuery.q,
    ...(listUserNotFriendReqQuery.offset !== undefined && { offset: listUserNotFriendReqQuery.offset.toString() }),
    ...(listUserNotFriendReqQuery.limit !== undefined && { limit: listUserNotFriendReqQuery.limit.toString() }),
  };
  const urlSearchParams = new URLSearchParams(queryParams).toString()

  const res = await fetch(`${localhostV0}/user/list/not_friend?${urlSearchParams}`,{
    headers: {
      'Content-Type': 'application/json',
      "Cookie": `session_token=${session_token}`
    } // 注意这里的 Cookie 是从浏览器中复制的, 用于服务端程序测试, 客户端会自动携带
  })

  console.log(res)
  const resBody = await res.json()
  console.log(resBody)
}

const addFriendSendReqBody: AddFriendSendRequest ={
  receiver_id: "66fb4ddd-c902-4d4c-a37c-bcaf5d8fb725"
}
const fetchAddFriendSend = async () => {
  const res = await fetch(`${localhostV0}/user/friend/request/send`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json', // 注意这里的 Content-Type 是必须的, 否则服务端无法解析 body
      "Cookie": `session_token=${session_token}`
    },
    body: JSON.stringify(addFriendSendReqBody)
  })

  console.log(res)
  const resBody = await res.json()
  console.log(resBody)
}

const fetchFriendNotificationList = async () => {
  const res = await fetch(`${localhostV0}/friend/notification/list`,{
    headers: {
      'Content-Type': 'application/json',
      "Cookie": `session_token=${session_token}`
    }
  })

  console.log(res)
  const resBody = await res.json()
  console.log(JSON.stringify(resBody, null, 2))
}

async function main() {
  // await fetchListUserNotFriend();
  // await fetchAddFriendSend();
  await fetchFriendNotificationList();
}

if (require.main === module) {
  main().catch(console.error);
}