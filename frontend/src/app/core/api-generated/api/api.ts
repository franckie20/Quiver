export * from './catalog.service';
import { CatalogService } from './catalog.service';
export * from './userSettings.service';
import { UserSettingsService } from './userSettings.service';
export const APIS = [CatalogService, UserSettingsService];
