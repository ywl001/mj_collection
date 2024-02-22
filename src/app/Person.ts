// import { RelativeFlag } from "./appType";
import * as IDValidator from 'id-validator'
// declare var IDValidator;
export class People {
    id?: number;
    name?: string;
    pid?: string;
    father_id?: string;
    mother_id?: string;

    // relativeFlag?: RelativeFlag;

    thumb_url?: string;

    birthday?: string;
    sex?: string;
    telephone?: string;
    work_place?:string;

    pb_id?:number;
    is_host?:number;

    static male = '男'
    static female = '女'

    static serverImg = 'http://114.115.201.238/mjmap/images/'

    // getRelation(p: People): RelativeFlag {
    //     const year = Number(p.pid.substring(6, 10));
    //     const baseYear = Number(this.pid.substring(6, 10));

    //     if (baseYear > year && baseYear - year > 15) {
    //         return p.sex == '男' ? RelativeFlag.father : RelativeFlag.mother;
    //     } else if (baseYear < year && year - baseYear > 15) {
    //         return p.sex == '男' ? RelativeFlag.son : RelativeFlag.daughter
    //     } else {
    //         return null;
    //     }
    // }

    // getRelation2(p: People): RelativeFlag {
    //     if (p.sex == '男') {
    //         if (p.father_id == this.pid || p.mother_id == this.pid) {
    //             return RelativeFlag.son;
    //         } else if (p.pid == this.father_id) {
    //             return RelativeFlag.father;
    //         }
    //     } else {
    //         if (p.father_id == this.pid || p.mother_id == this.pid) {
    //             return RelativeFlag.daughter;
    //         } else if (p.pid == this.mother_id) {
    //             return RelativeFlag.mother;
    //         }
    //     }
    //     return RelativeFlag.unKnow;
    // }

    isParent(p:People){
        return this.father_id==p.pid || this.mother_id == p.pid
    }

    isChild(p:People){
        return p.father_id == this.pid || p.mother_id == this.pid
    }

    isRandomPid() {
        return this.pid.substring(0, 8) == '41000018'
    }

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