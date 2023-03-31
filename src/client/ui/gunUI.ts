import GunModel from "../../model/gun";

export default class GunUI {
    private getText(gun: GunModel): string[] {
        if(gun.isReloading) { return [ "RELOADING..." ]; }

        return [
            `${gun.name} (${gun.fireMode})`,
            `AMMO: ${gun.ammo}/${gun.ammoCapacity}`
        ]
    }

    render(context: CanvasRenderingContext2D, gun: GunModel): void {
        context.resetTransform();

        context.font = "bold 25px Arial";
        context.textAlign = "left";
        context.textBaseline = "bottom";
        context.fillStyle = "#ff0000";
        context.strokeStyle = "#e60202";

        const text: string[] = this.getText(gun);

        context.translate(0, -((text.length - 1) * 30));
   
        for (let index = 0; index < text.length; index++) {
            const txt = text[index];
            const y = (30 * index);

            context.fillText(txt, 0, document.body.clientHeight + y);
            context.strokeText(txt, 0, document.body.clientHeight + y);
        }
    }
}