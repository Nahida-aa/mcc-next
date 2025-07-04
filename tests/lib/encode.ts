import { base64ToUuid, slugToUuid, uuidToBase64, uuidToSlug } from "@/lib/utils/encode";



if (require.main === module) {
  // bun tests/lib/encode.ts
// import { v4 as uuidv4 } from "uuid";
// 示例用法
const uuid = "123e4567-e89b-12d3-a456-426614174000";
console.log("Original UUID:", uuid);

const slug = uuidToSlug(uuid);
console.log(slug);

const restoredUuid = slugToUuid(slug);
console.log(restoredUuid);

const base64 = uuidToBase64(uuid);
console.log(base64);

console.log(base64ToUuid(base64));
}
