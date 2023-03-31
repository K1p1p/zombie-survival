import GunModel from "../../model/gun";

export default class GunUI {
    private getText(gun: GunModel): string {
        if(gun.isReloading) { return "RELOADING..."; }

        return `${gun.name} - (${gun.fireMode}) - AMMO: ${gun.ammo}/${gun.ammoCapacity}`;
    }

    render(context: CanvasRenderingContext2D, gun: GunModel): void {
        context.resetTransform();

        context.font = "bold 40px Arial";
        context.textAlign = "left";
        context.textBaseline = "bottom";

        context.fillStyle = "red";
        context.fillText(this.getText(gun), 0, document.body.clientHeight);

        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.strokeText(this.getText(gun), 0, document.body.clientHeight);
    }
}