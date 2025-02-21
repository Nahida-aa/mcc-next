import fs from 'fs';
import path from 'path';
import gameVersions from '~/constants/gameVersions.json'
import { filterReleaseVersions } from "~/lib/utils/mc";

if (require.main === module) {
  // bun tests/init/generated/gameVersions.ts
  const releaseVersions = filterReleaseVersions(gameVersions);
  
  const outputPath = path.resolve(__dirname, '../../../src/constants/gameReleaseVersions.json');
  fs.writeFileSync(outputPath, JSON.stringify(releaseVersions, null, 2));
  
  console.log('Release versions JSON file generated successfully.');
}
