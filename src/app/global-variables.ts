import { Building, Hosing } from "./app-type";

export class GVar {
    static current_hosing: Hosing;
    static current_building: Building;
    static current_room_number: string
}