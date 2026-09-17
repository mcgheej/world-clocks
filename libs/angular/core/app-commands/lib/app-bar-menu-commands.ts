/**
 * edit number of columns
 * add new clock
 * add clock from recently used
 * rearrange clocks
 * exit app
 */

import { createCommand, props } from '@core/command-bus/index';
import { ClockProfile } from '@data/data-models/index';

export const EDIT_NUMBER_OF_COLUMNS = '[AppBarMenu] edit number of columns';
export const ADD_NEW_CLOCK = '[AppBarMenu] add new clock';
export const ADD_CLOCK_FROM_RECENTLY_USED = '[AppBarMenu] add clock from recently used';
export const REARRANGE_CLOCKS = '[AppBarMenu] rearrange clocks';
export const EXIT_APP = '[AppBarMenu] exit app';

export const editNumberOfColumns = createCommand(EDIT_NUMBER_OF_COLUMNS);
export const addNewClock = createCommand(ADD_NEW_CLOCK);
export const addClockFromRecentlyUsed = createCommand(
  ADD_CLOCK_FROM_RECENTLY_USED,
  props<{ clock: ClockProfile; index: number }>(),
);
export const rearrangeClocks = createCommand(REARRANGE_CLOCKS);
export const exitApp = createCommand(EXIT_APP);

export type AppBarMenuCommands =
  | ReturnType<typeof editNumberOfColumns>
  | ReturnType<typeof addNewClock>
  | ReturnType<typeof addClockFromRecentlyUsed>
  | ReturnType<typeof rearrangeClocks>
  | ReturnType<typeof exitApp>;
