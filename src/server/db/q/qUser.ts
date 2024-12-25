'server-only';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { db } from '..';
import { linkUserFollow } from '../schema/link';
import { user as usersTable, idCardInfo as idCardInfoTable } from '../schema/user';
import type { User } from '../schema/user';


// 定义新的输入类型，包含关系字段，并将 name 和 password 设为必选字段
type CreateUserInput = Omit<Partial<User>, 'name' | 'password'> & {
  name: string;
  password: string;
  idCardInfo: {
    id_card_number: string;
    idCardHolder?: string; // self | guardian
    // isRealName?: boolean; // 这个字段不由用户填写
    frontImageUrl?: string;
    backImageUrl?: string;
  };
};
type CreateUserOutput = User & { idCardInfo?: typeof idCardInfoTable.$inferInsert };
// 创建user
export async function create(new_user: CreateUserInput): Promise<CreateUserOutput> {
// export async function create(new_user) {
  if (!new_user.name || !new_user.password) {
    throw new Error('Name and password are required');
  }
  // const user: typeof usersTable.$inferInsert = new_user
  const user: typeof usersTable.$inferInsert = {
    name: new_user.name,
    image: new_user.image,
    nickname: new_user.nickname,
    phone: new_user.phone,
    gender: new_user.gender,
    age: new_user.age,
    email: new_user.email,
    password: new_user.password,
    platform_info: new_user.platform_info,
  };
  const [dbUser] = await db.insert(usersTable).values(user).returning()

  let dbIdCardInfo;
  if (new_user.idCardInfo) {
    const idCardInfo = {
      ...new_user.idCardInfo,
      userId: dbUser.id,
    };
    [dbIdCardInfo] = await db.insert(idCardInfoTable).values(idCardInfo).returning();
  }
  return {
    ...dbUser,
    idCardInfo: dbIdCardInfo,
  }
}

export class QUser {
  static async getByName(name: string) {
    const users = await db.select().from(usersTable).where(eq(usersTable.name, name));
    return users
  }
}