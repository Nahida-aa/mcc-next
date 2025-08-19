import { querySchema } from "../page";
import { ProjectUI } from "../_comp/ProjectUI";

export default async function ProjectListPageUI({
  searchParams,
}: {
  searchParams: Promise<
  {
    role?: string;
    mode?: string;
    type?: string;
    page?: string;
    sort?: string;
    keyword?: string;
    tags?: string;
    gameVersions?: string;
    loaders?: string;
    environment?: string;
    isOpenSource?: string;
  }
  >
}) {
  const { role, ...itemSearchParams } = await searchParams
  console.log("ProjectListPageUI:searchParams:", role)
  const parsedQuery = querySchema.parse(itemSearchParams);
  console.log("ProjectListPageUI:parsedQuery: ", parsedQuery)
  const type = 'mod'

  return <>
    <ProjectUI type={type} gameVersions={parsedQuery.versions} isOpenSource={parsedQuery.isOpen} {...parsedQuery} />
  </>
}