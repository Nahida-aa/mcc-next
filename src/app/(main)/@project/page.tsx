import { querySchema } from "../page";
import { Client } from "./client";

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
    game_versions?: string;
    loaders?: string;
    environment?: string;
    is_open_source?: string;
  }
  >
}) {
  const { role, ...itemSearchParams } = await searchParams
  console.log("ProjectListPageUI:searchParams:", role)
  const parsedQuery = querySchema.parse(itemSearchParams);
  console.log("ProjectListPageUI:parsedQuery: ", parsedQuery)
  const type = 'mod'

  return <>
    <Client type={type} game_versions={parsedQuery.versions} is_open_source={parsedQuery.is_open} {...parsedQuery} />
  </>
}