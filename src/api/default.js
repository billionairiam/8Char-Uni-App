import {APP_API, Get, Post} from '@/utils/request';

export const GetTips = () => Get('/8char/get-tips',{},APP_API)
export const GetVersion = () => Get('/8char/get-version',{},APP_API)
export const GetInfo = data => Post('/8char/get-info', data, "http://127.0.0.1:8537");
export const GetBook = data => Post('/8char/get-book', data, "http://127.0.0.1:8537");
export const GetPrediction = data => Post('/8char/get-prediction', data, "http://127.0.0.1:8537");
