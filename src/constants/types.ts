// import gameVersions from '@/constants/gameVersions.json'

export type GameVersion = {
  version: string
  version_type: string // release, snapshot, alpha, beta
  date: string // "2011-09-14T22:00:00Z"
  major: boolean // 暂时不用
}