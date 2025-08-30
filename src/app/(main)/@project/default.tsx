import { ListProjectQuery, listProjectQuerySchema } from "@/server/project/model";
import { ProjectUI } from "../_comp/ProjectUI";

export default async function ProjectListPageUI({
  searchParams,
}: {
  searchParams: Promise<ListProjectQuery & {
    role?: string;
  }>
}) {
  const { role, ...itemSearchParams } = await searchParams
  console.log("ProjectListPageUIDefault:searchParams:", role)
  const parsedQuery = listProjectQuerySchema.parse(itemSearchParams);
  console.log("ProjectListPageUIDefault:parsedQuery: ", parsedQuery)
  const type = 'mod'

  return <>
    <ProjectUI type={type} gameVersions={parsedQuery.gameVersions} isOpenSource={parsedQuery.isOpenSource} {...parsedQuery} />
  </>
}