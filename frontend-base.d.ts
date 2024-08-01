import { OpenedXConfig } from "./";

declare module 'env.config' {
  export default OpenedXConfig;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
