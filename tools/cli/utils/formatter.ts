exports.format = (messages: Record<string, { defaultMessage: string, description: string }>) => Object.fromEntries(
  Object.entries(messages).map(([id, { defaultMessage }]) => [id, defaultMessage]),
);
