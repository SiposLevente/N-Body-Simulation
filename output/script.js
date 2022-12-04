"use strict";
class Velocity {
    vx;
    vy;
    constructor(x, y) {
        this.vx = x;
        this.vy = y;
    }
    InvertVx() {
        this.vx = -this.vx;
    }
    InvertVy() {
        this.vy = -this.vy;
    }
    get VX() {
        return this.vx;
    }
    get VY() {
        return this.vy;
    }
    AddToVX(num) {
        this.vx += num;
    }
    AddToVY(num) {
        this.vy += num;
    }
    SubFromVX(num) {
        this.AddToVX(-num);
    }
    SubFromVY(num) {
        this.AddToVY(-num);
    }
}
class Postition {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    DistanceFrom(other_pos) {
        return Math.sqrt(Math.pow(this.X - other_pos.X, 2) + Math.pow(this.Y - other_pos.Y, 2));
    }
    get X() {
        return this.x;
    }
    get Y() {
        return this.y;
    }
    AddToX(num) {
        this.x += num;
    }
    AddToY(num) {
        this.y += num;
    }
    SubFromX(num) {
        this.AddToX(-num);
    }
    SubFromY(num) {
        this.AddToY(-num);
    }
    isEquals(position) {
        return (this.X == position.X) && (this.Y == position.Y);
    }
}
class Body {
    position;
    velocity;
    mass;
    color;
    constructor(x, y, vx, vy, mass, color) {
        this.position = new Postition(x, y);
        this.velocity = new Velocity(vx, vy);
        this.mass = mass;
        this.color = color;
    }
    get Mass() {
        return this.mass;
    }
    set Mass(value) {
        this.mass = value;
    }
    get Color() {
        return this.color;
    }
    set Color(value) {
        this.color = value;
    }
    get Position() {
        return this.position;
    }
    get Velocity() {
        return this.velocity;
    }
    OffsetVelocity(dvx, dvy) {
        this.velocity.AddToVX(dvx);
        this.velocity.AddToVY(dvy);
    }
    OffsetPosition(dx, dy) {
        this.position.AddToX(dx);
        this.position.AddToY(dy);
    }
}
class Color {
    red;
    get Red() {
        return this.red;
    }
    set Red(value) {
        this.red = value % 256;
    }
    green;
    get Green() {
        return this.green;
    }
    set Green(value) {
        this.green = value % 256;
    }
    blue;
    get Blue() {
        return this.blue;
    }
    set Blue(value) {
        this.blue = value % 256;
    }
    alpha;
    get Alpha() {
        return this.alpha;
    }
    set Alpha(value) {
        this.alpha = value;
    }
    static GenerateRandomColor() {
        return new Color(GenerateRandomNumber(0, 255), GenerateRandomNumber(0, 255), GenerateRandomNumber(0, 255));
    }
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = 1.0;
    }
}
const G = 6.673e-11;
const base_mass = 100000;
const default_mass = 5 * base_mass;
const min_mass = 1 * base_mass;
const max_mass = 10 * base_mass;
const black_hole_mass = 20 * base_mass;
const trails_input = document.getElementById("enable_trails");
const auto_reset_input = document.getElementById("auto_reset");
const body_size_input = document.getElementById("body_size");
const time_flow_input = document.getElementById("time_flow");
const body_number_input = document.getElementById("body_number");
const random_mass_input = document.getElementById("random_mass");
let body_size = 2;
let time_flow = 1;
let draw_trails = trails_input.checked;
let auto_reset = auto_reset_input.checked;
let canvas = document.getElementById("canvas_id");
canvas.width = screen.width;
canvas.height = screen.height;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext("2d");
let body_array = [];
let out_of_bounds_counter = 0;
main();
async function main() {
    ResetEverything();
    while (true) {
        for (let i = 0; i < body_array.length; i++) {
            for (let j = i + 1; j < body_array.length; j++) {
                CalculateForce(body_array[i], body_array[j]);
            }
        }
        if (!draw_trails) {
            ClearCanvas();
        }
        UpdateBodies();
        DrawBodies();
        out_of_bounds_counter = 0;
        await sleep(time_flow);
    }
}
function TrailsChange() {
    draw_trails = trails_input.checked;
}
function AutoResetChange() {
    auto_reset = auto_reset_input.checked;
}
function ClearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}
function ResetCanvas() {
    body_array = [];
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}
function SizeChange() {
    body_size = Number.parseInt(body_size_input.value);
}
function TimeChange() {
    time_flow = Number.parseInt(time_flow_input.value);
}
function InputChanged() {
    ResetCanvas();
    for (let index = 0; index < Number.parseInt(body_number_input.value); index++) {
        let x = GenerateRandomNumber(0, canvasWidth);
        let vx = Math.random() * Math.floor(Math.random() * (3)) - 1;
        let y = GenerateRandomNumber(0, canvasHeight);
        let vy = Math.random() * Math.floor(Math.random() * (3)) - 1;
        let color = Color.GenerateRandomColor();
        let mass = default_mass;
        if (random_mass_input.checked) {
            mass = GenerateRandomNumber(min_mass, max_mass);
            if (color.Red == 255 && color.Green == 255 && color.Blue == 255) {
                mass = black_hole_mass;
            }
        }
        body_array.push(new Body(x, y, vx, vy, mass, color));
    }
    DrawBodies();
}
function ResetEverything() {
    InputChanged();
}
function GenerateRandomNumber(min, max) {
    if (max >= min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    else {
        throw new RangeError("ERROR! Minimum number must be smaller or equal to maximum number!");
    }
}
function DrawPixel(position, width, height, color) {
    if (ctx != null) {
        if (position.X >= 0 && position.X <= canvasWidth && position.Y >= 0 && position.Y <= canvasHeight) {
            ctx.fillStyle = `rgb(${color.Red},${color.Green},${color.Blue},${color.Alpha})`;
            ctx.fillRect(position.X, position.Y, width, height);
        }
        else {
            out_of_bounds_counter++;
            if (out_of_bounds_counter == body_array.length) {
                ResetEverything();
            }
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function DrawBodies() {
    body_array.forEach(body => {
        DrawPixel(body.Position, body_size, body_size, body.Color);
    });
}
function CalculateForce(body1, body2) {
    if (!body1.Position.isEquals(body2.Position)) {
        let distance = body1.Position.DistanceFrom(body2.Position);
        let force = (G * body1.Mass * body2.Mass * distance) / Math.pow(Math.abs(distance), 3);
        let delta_x = (body2.Position.X - body1.Position.X) * force;
        let delta_y = (body2.Position.Y - body1.Position.Y) * force;
        body1.Velocity.AddToVX(delta_x);
        body1.Velocity.AddToVY(delta_y);
        body2.Velocity.AddToVX(-delta_x);
        body2.Velocity.AddToVY(-delta_y);
    }
}
function UpdateBodies() {
    body_array.forEach(body => {
        body.Position.AddToX(body.Velocity.VX);
        body.Position.AddToY(body.Velocity.VY);
    });
}
function Reset() {
    ResetEverything();
}
window.onresize = () => {
    canvas.width = screen.width;
    canvas.height = screen.height;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
};
