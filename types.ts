export enum Screen {
  HOME = 'HOME',
  NAVIGATION_SETUP = 'NAVIGATION_SETUP',
  NAVIGATION_ACTIVE = 'NAVIGATION_ACTIVE',
  SETTINGS = 'SETTINGS',
  EMERGENCY = 'EMERGENCY',
  WEATHER_DETAIL = 'WEATHER_DETAIL',
  DEVICE_DETAIL = 'DEVICE_DETAIL',
  GRIP_SETTINGS = 'GRIP_SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export enum GripState {
  IDLE = 'IDLE',
  PULSE = 'PULSE',       // Gentle rhythmic pulse (Straight/Wait)
  INFLATE_LEFT = 'LEFT', // Left side expands (Turn Left)
  INFLATE_RIGHT = 'RIGHT', // Right side expands (Turn Right)
  WARNING = 'WARNING'    // Rapid vibration (Stop/Obstacle)
}

export interface NavigationStep {
  instruction: string;
  distance: string;
  direction: 'left' | 'right' | 'straight' | 'arrive';
}

export interface DeviceStatus {
  batteryLevel: number;
  gripPressure: number; // 0-100%
  isConnected: boolean;
}