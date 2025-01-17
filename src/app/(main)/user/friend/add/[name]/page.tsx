export default async function AddFriendByNamePage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const name = (await params).name
  const decodeURLComponentName = decodeURIComponent(name)

  return <div>
    <span>
      My Name: {name} 
    </span>
    <br />
    <span>
      My Decoded Name: {decodeURLComponentName}
    </span>
  </div>
}