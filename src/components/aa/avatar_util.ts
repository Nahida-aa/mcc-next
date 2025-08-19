export const getAvatarUrl = (image?: string | null, id?: string): string => {

  return image ? image : `https://avatar.vercel.sh/${id}`;
}