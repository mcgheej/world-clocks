/**
 * ClockBoardConfig
 * ----------
 * Represents a panel of clocks, including the number of columns and the list of clocks it contains.
 */
import { ClockProfile } from './clock-profile';

export interface ClockBoardConfig {
  numberOfColumns: number;
  clockProfiles: ClockProfile[];
}
