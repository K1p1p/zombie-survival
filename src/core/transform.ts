import Vector, { VectorZero } from "./vector.js";
import { normalize } from "./vectorMath.js";

export default class Transform {
    private _position: Vector;
    private _rotation: number;
    private _direction: Vector;

    constructor(position: Vector, rotation: number = 0, direction: Vector = VectorZero()) {
        this._position = position;
        this._rotation = rotation;
        this._direction = direction;
    }

    public get position()  : Vector { return this._position;  }
    public get rotation()  : number { return this._rotation;  }
    public get direction() : Vector { return this._direction; }

    public set position(vector  : Vector) { this._position = vector;   }
    public set rotation(radians : number) { this.setRotation(radians); }
    public set direction(vector : Vector) { this.setDirection(vector); }
    
    setRotation(radians: number) {
        this._rotation = radians;

        this._direction = normalize({
            x: Math.cos( radians),
            y: Math.sin(-radians)
        });
    }

    setDirection(dir: Vector) {
        this._direction = normalize(dir);
        this._rotation = Math.atan2(-this._direction.y, this._direction.x);
    }

    translate(step: Vector) {
        // Relative to self
        //this.position.x += (this.direction.x * step.x);
        //this.position.y += (this.direction.y * step.y);

        this._position.x += step.x;
        this._position.y += step.y;
    }

    lookAt(target: Vector) {
        const delta: Vector = {
            x: (target.x - this._position.x),
            y: (target.y - this._position.y),
        }

        this.setDirection(delta);
    }
}
