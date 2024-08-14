import { OpenedXConfig } from "./";

declare module 'site.config' {
  export default OpenedXConfig;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
