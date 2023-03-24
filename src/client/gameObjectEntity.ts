type Create<GameObject, DTO> = (data: DTO) => GameObject;
type Update<GameObject, DTO> = (gameObject: GameObject, data: DTO) => void;

type Actions<GameObject, DTO> = {
    createGameObject: Create<GameObject, DTO>;
    updateEntity: Update<GameObject, DTO>;
}

interface GameObjectEntity<GameObject> {
    id: string;
    lastUpdate: number;

    gameObject: GameObject;
}

export class GameObjectEntityList<GameObject, DTO extends { id: string }> {
    private autoDeleteOrphanEntities: boolean = true;

    private actions: Actions<GameObject, DTO>;

    private entities: { [index: string]: GameObjectEntity<GameObject>; } = {};

    constructor(actions: Actions<GameObject, DTO>) {
        this.actions = actions;
    }

    public forEach(callbackFn: ((entity: GameObjectEntity<GameObject>) => void)) {
        for (let key in this.entities) {
            callbackFn(this.entities[key]);
        }
    }

    public onServerUpdate(updatedData: DTO[]) {
        updatedData.forEach((data) => {
            const entity = this.entities[data.id];

            if(entity) {
                // Update entity
                this.actions.updateEntity(entity.gameObject, data);
                
                entity.lastUpdate = Date.now();
            } else {
                // Create new entity
                this.entities[data.id] = {
                    id: data.id,
                    lastUpdate: Date.now(),
                    gameObject: this.actions.createGameObject(data)
                };
            }
        })

        if(this.autoDeleteOrphanEntities){
            this.deleteOrphanEntities();
        }
    }

    // Destroy entities which were not updated for some time since last server update
    private deleteOrphanEntities() {
        for (let key in this.entities) {
            const lastUpdate = this.entities[key].lastUpdate;
    
            // Not updated in the last 50ms since last server update
            if((Date.now() - lastUpdate) > 50) {
                delete this.entities[key];
            }  
        }
    }
}