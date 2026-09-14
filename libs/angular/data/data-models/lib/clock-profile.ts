/**
 * Clock
 * -----
 * Represents a clock by it's location name, IANA timezone, and display options.
 */
export interface ClockProfile {
  placeName: string;
  ianaTimezone: string;
  withHighlight: boolean;
  withSeconds: boolean;
}
