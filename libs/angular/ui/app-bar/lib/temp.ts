export interface Action<TType extends string, TPayload = never> {
  readonly type: TType;
  readonly payload: TPayload;
}

export type NoPayloadAction<TType extends string> = {
  readonly type: TType;
};

export type ActionCreator<TType extends string, TPayload = never> = [TPayload] extends [never]
  ? () => NoPayloadAction<TType>
  : (payload: TPayload) => Action<TType, TPayload>;

type PayloadDefinition<TPayload> = {
  readonly kind: 'payload';
  readonly payload?: TPayload;
};

export function props<TPayload>(): PayloadDefinition<TPayload> {
  return { kind: 'payload' };
}

export function createAction<TType extends string>(type: TType): ActionCreator<TType>;
export function createAction<TType extends string, TPayload>(
  type: TType,
  payloadDefinition: PayloadDefinition<TPayload>,
): ActionCreator<TType, TPayload>;
export function createAction<TType extends string, TPayload>(
  type: TType,
  payloadDefinition?: PayloadDefinition<TPayload>,
): ActionCreator<TType> | ActionCreator<TType, TPayload> {
  if (payloadDefinition) {
    return ((payload: TPayload) => ({ type, payload })) as ActionCreator<TType, TPayload>;
  }

  return (() => ({ type })) as ActionCreator<TType, TPayload>;
}

export const loadUsers = createAction('[User Command] Load Users');
export const loadUsersSuccess = createAction(
  '[User Command] Load Users Success',
  props<{ users: readonly string[] }>(),
);
export const loadUsersFailure = createAction(
  '[User Command] Load Users Failure',
  props<{ error: string }>(),
);

export type UserActions =
  | ReturnType<typeof loadUsers>
  | ReturnType<typeof loadUsersSuccess>
  | ReturnType<typeof loadUsersFailure>;

export function handleUserAction(action: UserActions): string {
  switch (action.type) {
    case '[User Command] Load Users':
      return 'Loading users';
    case '[User Command] Load Users Success':
      return `Loaded ${action.payload.users.length} users`;
    case '[User Command] Load Users Failure':
      return `Unable to load users: ${action.payload.error}`;
    default: {
      const unhandledAction: never = action;
      throw new Error(`Unhandled user action: ${unhandledAction}`);
    }
  }
}
