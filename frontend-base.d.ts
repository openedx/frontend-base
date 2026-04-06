declare module 'site.config' {
  export default SiteConfig;
}

declare module 'site.i18n' {
  export default SiteMessages;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
