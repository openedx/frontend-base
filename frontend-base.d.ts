import { ProjectSiteConfig } from "./index";

declare module 'site.config' {
  export default ProjectSiteConfig;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
