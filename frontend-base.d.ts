/// <reference types="./index.d.ts" />

import { OpenedXConfig } from "./dist";

declare module 'env.config' {
  export default OpenedXConfig;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
