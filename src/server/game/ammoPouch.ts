import { GUN_ID } from "../../model/gun";

export default class AmmoPouch {
    private ammo: AmmoPouchItem[] = [
        new AmmoPouchItem(GUN_ID.GENERIC_PISTOL, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new AmmoPouchItem(GUN_ID.GENERIC_ASSAULT_RIFLE, 15, 500),
    ]

    public getAmmoPouchItem(id: GUN_ID): AmmoPouchItem | undefined {
        return this.ammo.find((item) => item.id === id);
    }
} 

export class AmmoPouchItem {
    id: GUN_ID;
    ammo: number;
    maxAmmo: number;

    constructor(id: GUN_ID, ammo: number, maxAmmo: number) {
        this.id = id;
        this.ammo = ammo;
        this.maxAmmo = maxAmmo;
    }

    addAmmo(amount: number) {
        this.ammo = Math.min((this.ammo + amount), this.maxAmmo);
    }

    removeAmmo(amount: number): number {
        if(this.ammo >= amount) { 
            this.ammo -= amount;
            return amount; 
        }

        const rest: number = this.ammo;
        this.ammo = 0;
        return rest;
    }
}