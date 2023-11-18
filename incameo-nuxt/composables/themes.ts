type AppTheme = 'material' | 'ios' | 'parent' | undefined;

export const getAppTheme = () => useState<AppTheme>('appTheme', () => "material")

export const setAppTheme = (theme: AppTheme) => getAppTheme().value = theme;