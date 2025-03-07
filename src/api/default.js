import {APP_API, Get, Post} from '@/utils/request';

export const GetTips = () => Get('/8char/get-tips',{},APP_API)
export const GetVersion = () => Get('/8char/get-version',{},APP_API)
export const GetInfo = data => Post('/8char/get-info', data, "https://0x311008.com");
export const GetBook = data => Post('/8char/get-book', data, "https://0x311008.com");
