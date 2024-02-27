import { People } from "./Person";
import { Building, Hosing } from "./app-type";

export class GVar {
    static current_hosing: Hosing;
    static current_building: Building;
    static current_room_number: string;

    //记录building页面打开的面包的index和楼栋的buildingInfo
    static panelIndex:number = -1;
    static savedScrollPosition;

    static homePeopleHost:People;
    
}