exports.format = (messages: { [messageId: string]: { defaultMessage: string, description: string}}) => {
  const results = Object.entries(messages).map(([id, message]) => (
    {
      id,
      defaultMessage: message.defaultMessage,
      description: message.description,
    }
  ));
  return results;
};
