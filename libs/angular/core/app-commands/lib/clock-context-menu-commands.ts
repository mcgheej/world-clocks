import { createCommand, props } from '@core/command-bus/index';
import { ClockProfile } from '@data/data-models/index';

export const TOGGLE_SHOW_SECONDS = '[ClockContextMenu] toggle show seconds';
export const TOGGLE_HIGHLIGHT_CLOCK = '[ClockContextMenu] toggle highlight clock';
export const EDIT_CLOCK = '[ClockContextMenu] edit clock';
export const DELETE_CLOCK = '[ClockContextMenu] delete clock';
export const REPLACE_CLOCK_FROM_RECENTLY_USED =
  '[ClockContextMenu] replace clock from recently used';

export const toggleShowSeconds = createCommand(TOGGLE_SHOW_SECONDS, props<{ index: number }>());
export const toggleHighlightClock = createCommand(
  TOGGLE_HIGHLIGHT_CLOCK,
  props<{ index: number }>(),
);
export const editClock = createCommand(EDIT_CLOCK, props<{ clock: ClockProfile; index: number }>());
export const deleteClock = createCommand(DELETE_CLOCK, props<{ index: number }>());
export const replaceClockFromRecentlyUsed = createCommand(
  REPLACE_CLOCK_FROM_RECENTLY_USED,
  props<{ clock: ClockProfile; index: number }>(),
);

export type ClockContextMenuCommands =
  | ReturnType<typeof toggleShowSeconds>
  | ReturnType<typeof toggleHighlightClock>
  | ReturnType<typeof editClock>
  | ReturnType<typeof deleteClock>
  | ReturnType<typeof replaceClockFromRecentlyUsed>;
