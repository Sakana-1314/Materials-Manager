import { publicUrl } from '@/config/env'

/** 站点 Logo；经 publicUrl 拼接构建 base，子路径部署时也能正确加载。 */
export const LOGO_URL = publicUrl('logo.png')
