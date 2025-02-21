type CreateDBProjectReleaseInput = {
  name: string;
  project_id: string;
  creator_id: string;
  version_number: string;
  game_versions: string[];
  type: string; // release, beta, alpha
  description?: string;
  project: {
    loaders: string[];
  },
  files: {
    filename: string
    url: string
    size: number
    is_primary: boolean
    type: string
  }[]
}

export const createDBProjectRelease = async (input: CreateDBProjectReleaseInput) => {
  // 1. create ProjectRelease
  // 2. create ReleaseFile list 
  // 3. update Project
}