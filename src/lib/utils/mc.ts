import { GameVersion } from "~/constants/types";

export const filterReleaseVersions = (versions: GameVersion[]): GameVersion[] => {
  return versions.filter(version => version.version_type === 'release');
};