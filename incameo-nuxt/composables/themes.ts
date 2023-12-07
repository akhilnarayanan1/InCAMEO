type AppTheme = 'material' | 'ios';

export const appTheme = () => useState<AppTheme>('appTheme', () => "material");

export const setAppTheme = (theme: AppTheme) => appTheme().value = theme;

export const getAppTheme = () => appTheme().value;