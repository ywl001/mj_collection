
import IDValidator from 'id-validator'

export class People {
    id?: number;
    name?: string;
    pid?: string;
    father_id?: string;
    mother_id?: string;


    thumb_url?: string;

    birthday?: string;
    sex?: string;
    telephone?: string;
    work_place?:string;

    pb_id?:number;
    is_host?:number;
    is_huji?:number;

    static male = '男'
    static female = '女'

    static serverImg = 'http://114.115.201.238/mjmap/images/'

    static isPid(str: string) {
        const validator = new IDValidator();
        return validator.isValid(str)
    }

    static isChinese(str: string) {
        const re = /^[\u4E00-\u9FA5]+$/g;
        if (!re.test(str)) return false;
        return true;
    }

    static toPeople(o:any){
        return Object.assign(new People(),o)
    }

}