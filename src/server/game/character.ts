import Transform from "../../core/transform.js";
import INetworkObject from "../networkObject.js";

export default abstract class Character extends Transform implements INetworkObject {
    /*protected abstract id: string;
    protected abstract hp: number;
    protected abstract speed: number;*/

    //abstract toJSON(): string;
    abstract toModel(): any;

    /*matchesId(id: string): boolean {
        return (this.id === id);
    }*/
}