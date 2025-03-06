import {BASE_URL} from "@/config";
import {LunarUtil} from "lunar-javascript";
import {deleteFirstElement} from '@/utils/transform';

export const getUrl = path => {
    return BASE_URL + path;
}

export function GetChineseZodiac(sx){
    const index = deleteFirstElement(LunarUtil.SHENGXIAO).indexOf(sx);
    let path;
    if (index !== -1) {
        path = `/zodiac/${index}.svg`
    } else {
        path = `/site/logo.svg`
    }
    return getUrl(`static/icon${path}`);
}
