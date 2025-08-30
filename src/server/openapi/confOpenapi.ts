import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { AppOpenAPI } from "@/server/types";
import packageJson from '@/../package.json'
import { Scalar } from '@scalar/hono-api-reference' // 用到了 vue, 因此需要 nodejs 运行时, 更新: pnpm i @scalar/hono-api-reference@latest

export default async function configOpenAPI(app: AppOpenAPI) {
  app.doc31('/doc', (c) => ({
    openapi: '3.1.0',
    info: {
      title: 'Hono API',
      version: packageJson.version,
      description: `- [swagger-ui](/api/doc/swagger)\n- [scalar-ui](/api/doc/scalar)\n- [index](/)
      `,
    },
    servers: [
      {
        url: new URL(c.req.url).origin,
        description: `- 不要使用这个认证, 因为这个认证 默认调用的 /api/auth/token, 我没有实现这个接口, 请去 /api/auth/login 测试登录, 或 /api/auth/register 测试注册, 都会得到一样的效果`,
      },
    ],
    paths: {},
  })); // new endpoint
  app.openAPIRegistry.registerComponent('securitySchemes', 'SessionToken', {
    type: "apiKey",
    in: "cookie",
    name: "sessionToken",
  });
  app.openAPIRegistry.registerComponent('securitySchemes', 'OAuth2PasswordBearer', {
    type: "oauth2",
    flows: {
      password: {
        scopes: {
          readUser: "read user",
          writeSelf: "write user self",
        },
        tokenUrl: "/api/auth/token",
      },
    },
  });
  app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });
  app.openAPIRegistry.registerComponent('securitySchemes', 'CSRF', {
    type: "apiKey",
    in: "cookie",
    name: "csrfToken",
  });
  app.get('/doc/scalar', 
    Scalar({
      url: '/api/doc',
      // url: 'doc',
      pageTitle: 'API',
      theme: 'kepler',
      layout: 'modern',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    })
  );

  app.get('/doc/llms.txt', async (c) => {
    // Get the OpenAPI document
    const content = app.getOpenAPI31Document({
      openapi: '3.1.0',
      info: { title: 'Hono API', version: packageJson.version },
    }) // schema object
    const markdown = await createMarkdownFromOpenApi(JSON.stringify(content))
    return c.text(markdown)
  })
}