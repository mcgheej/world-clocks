export interface Command<TType extends string, TPayload = never> {
  readonly type: TType;
  readonly payload: TPayload;
}

export type NoPayloadCommand<TType extends string> = {
  readonly type: TType;
};

export type CommandCreator<TType extends string, TPayload = never> = [TPayload] extends [never]
  ? () => NoPayloadCommand<TType>
  : (payload: TPayload) => Command<TType, TPayload>;

type PayloadDefinition<TPayload> = {
  readonly kind: 'payload';
  readonly payload?: TPayload;
};

export function props<TPayload>(): PayloadDefinition<TPayload> {
  return { kind: 'payload' };
}

export function createCommand<TType extends string>(type: TType): CommandCreator<TType>;
export function createCommand<TType extends string, TPayload>(
  type: TType,
  payloadDefinition: PayloadDefinition<TPayload>,
): CommandCreator<TType, TPayload>;
export function createCommand<TType extends string, TPayload>(
  type: TType,
  payloadDefinition?: PayloadDefinition<TPayload>,
): CommandCreator<TType> | CommandCreator<TType, TPayload> {
  if (payloadDefinition) {
    return ((payload: TPayload) => ({ type, payload })) as CommandCreator<TType, TPayload>;
  }

  return (() => ({ type })) as CommandCreator<TType, TPayload>;
}
