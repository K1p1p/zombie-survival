import Entity from "../../../dto/entity";
import { GUN_ID } from "../../../model/gun";
import { LootModel, LOOT_TYPE, LootModelExtraDataForGun } from "../../../model/loot";
import Gun from "../gun/gun";
import AssaultRifle from "../gun/list/assaultRifle";
import Player from "../player";
import Loot from "./loot";

export class GunLoot extends Loot {
    id: GUN_ID;
    name: string;
    ammo: number;

    constructor(id: GUN_ID, name: string, ammo: number) {
        super();

        this.id = id;
        this.name = name;
        this.ammo = ammo;
    }

    use(player: Player): boolean {
        // Player already has this gun
        if(player.hasGun(this.id)) { return false; }

        switch(this.id) {
            case GUN_ID.GENERIC_ASSAULT_RIFLE: 
                player.addGun(new AssaultRifle(player));
            break;

            default: 
                return false;
        }

        return true;
    }

    toModel(): Entity<LootModel<LootModelExtraDataForGun>> {
        return {
            id: this.entityId,
            data: {
                name: this.name,
                itemType: LOOT_TYPE.GUN,
                transform: {
                    position: this.transform.position,
                    rotation: this.transform.rotation,
                    direction: this.transform.direction,
                },
                extraData: {
                    id: this.id,
                    currentAmmo: this.ammo
                }
            }
        }
    }
}