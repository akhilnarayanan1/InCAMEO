type AppTheme = 'material' | 'ios';
type LightingTheme = 'light' | 'dark';

export const appTheme = () => useState<AppTheme>('appTheme', () => "material");
export const setAppTheme = (theme: AppTheme) => appTheme().value = theme;
export const getAppTheme = () => appTheme().value;

export const appLighting = () => useState<LightingTheme>('appLighting', () => 'light');
export const setAppLighting = (lighting: LightingTheme) => appLighting().value = lighting;
export const getAppLighting = () => appLighting().value;