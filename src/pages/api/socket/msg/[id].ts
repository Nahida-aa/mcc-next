import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/types/index";
import { sendMessage } from "@/db/q/user/msg";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {}