import Entity from "../../../dto/entity";
import { LootModel, LOOT_TYPE } from "../../../model/loot";
import Player from "../player/player";
import Loot from "./loot";

export class MedKit extends Loot {
    use(player: Player): boolean {
        if(player.health === player.maxHealth) { return false; }

        player.health = Math.min((player.health + 25), player.maxHealth);
        
        return true;
    }

    toModel(): Entity<LootModel> {
        return {
            id: this.entityId,
            data: {
                name: "MedKit",
                itemType: LOOT_TYPE.MEDKIT,
                transform: {
                    position: this.transform.position,
                    rotation: this.transform.rotation,
                    direction: this.transform.direction,
                }
            }
        }
    }
}