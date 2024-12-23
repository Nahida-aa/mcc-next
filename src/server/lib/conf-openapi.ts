import { AppOpenAPI } from "./types";
import packageJson from '../../../package.json'
import { apiReference } from '@scalar/hono-api-reference'

export default function configOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.1.0',
    info: {
      title: 'Hono API',
      version: packageJson.version,
      description: `
      - [去swagger-ui](https://mcc.Nahida-aaus.kg/docs)
      `,
    }
  });

  app.get('/', 
    apiReference({
      theme: 'kepler',
      layout: 'modern',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
      spec: {
        url: '/api/hono/doc',
      },
    })
  );
}