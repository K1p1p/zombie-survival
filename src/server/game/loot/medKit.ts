import Entity from "../../../dto/entity";
import { LootModel, LOOT_TYPE } from "../../../model/loot";
import Player from "../player";
import Loot from "./loot";

export class MedKit extends Loot {
    use(player: Player) {
        player.health = Math.min((player.health + 25), player.maxHealth);
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