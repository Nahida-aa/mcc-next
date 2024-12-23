// 'use client';

// import dynamic from 'next/dynamic';
// import 'swagger-ui-react/swagger-ui.css';

// const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

// const SwaggerUIWrapper = () => {
//   return <SwaggerUI url="/api/hono/doc" />;
// };

// export default SwaggerUIWrapper;


'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  spec: Record<string, any>,
};

function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;