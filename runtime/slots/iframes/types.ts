export interface MessageEventCallbackParams {
  type: string,
  payload: any,
}

export type MessageEventCallback = ({ type, payload }: MessageEventCallbackParams) => void;
;
