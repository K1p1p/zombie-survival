import Vector from "../math/vector.js";
import Circle from "./circle.js";

export default class Line {
    start: Vector;
    end: Vector;

    public static intersectsVector(line: Line, vector: Vector): boolean {
        if (line.start.x != line.end.x) {
            if (line.start.x <= vector.x && vector.x <= line.end.x) return true;
            if (line.start.x >= vector.x && vector.x >= line.end.x) return true;
        } else {
            if (line.start.y <= vector.y && vector.y <= line.end.y) return true;
            if (line.start.y >= vector.y && vector.y >= line.end.y) return true;
        }
                
        return false;
    }

    public static intersectsLine(lineA: Line, lineB: Line): boolean {
        const denom = ((lineB.end.y - lineB.start.y) * (lineA.end.x   - lineA.start.x)) - ((lineB.end.x - lineB.start.x) * (lineA.end.y   - lineA.start.y));
        const numeA = ((lineB.end.x - lineB.start.x) * (lineA.start.y - lineB.start.y)) - ((lineB.end.y - lineB.start.y) * (lineA.start.x - lineB.start.x));
        const numeB = ((lineA.end.x - lineA.start.x) * (lineA.start.y - lineB.start.y)) - ((lineA.end.y - lineA.start.y) * (lineA.start.x - lineB.start.x));

        if (denom == 0) {
            if (numeA == 0 && numeB == 0) { 
                // COLINEAR

                // [TODO] COLLISION? MAYBE!
                // Check if the contact point is within the line segment
                // Line.intersectsVector(Something, Something)

                // CURRENTLY DEFAULTS TO TRUE
                return true;
            }

            //PARALLEL
            return false;
        }

        const uA = numeA / denom;
        const uB = numeB / denom;

        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            // Collision point
            /*{
                x: lineA.start.x + (uA * (lineA.end.x - lineA.start.x)),
                y: lineA.start.y + (uA * (lineA.end.y - lineA.start.y))
            }*/

            return true;
        }

        // NONE
        return false;
    }

    public static intersectsCircle(line: Line, circle: Circle): boolean {
        //check to see if start or end points lie within circle 
        if (Circle.intersectsVector(circle, line.start)) { return true; }
        if (Circle.intersectsVector(circle, line.end  )) { return true; }

        //vector d
        var dx = (line.end.x - line.start.x);
        var dy = (line.end.y - line.start.y);

        //vector lc
        var lcx = (circle.position.x - line.start.x);
        var lcy = (circle.position.y - line.start.y);

        //project lc onto d, resulting in vector p
        var dLen2 = ((dx * dx) + (dy * dy)); //len2 of d
        var px = dx;
        var py = dy;
        if (dLen2 > 0) {
            var dp = (lcx * dx + lcy * dy) / dLen2
            px *= dp
            py *= dp
        }

        // Nearest vector from line
        const nearest: Vector = {
            x: (line.start.x + px),
            y: (line.start.y + py),
        }; 

        //len2 of p
        var pLen2 = ((px * px) + (py * py));

        //check collision
        return Circle.intersectsVector(circle, nearest) && (pLen2 <= dLen2 && ((px * dx) + (py * dy)) >= 0);
    }
}