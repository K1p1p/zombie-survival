export default class ControlsUI {
    public static render(context: CanvasRenderingContext2D): void {
        const text: string[] = [
            "-- CONTROLS --",
            "MOVE: WASD",
            "AIM: MOUSE",
            "SHOOT: LEFT MOUSE BUTTON",
            "RELOAD: R",
            "CHANGE GUN: MOUSE WHEEL SCROLL | Q | E",
            "CHANGE GUN FIRE MODE: MOUSE WHEEL BUTTON | T",
        ];
   
        context.resetTransform();

        context.font = "bold 15px Arial";
        context.textAlign = "right";
        context.textBaseline = "top";

        for (let index = 0; index < text.length; index++) {
            const txt = text[index];
            const y = (25 * index);

            context.fillStyle = "red";
            context.fillText(txt, document.body.clientWidth, y);
        }
    }
}