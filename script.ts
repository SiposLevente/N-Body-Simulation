// ============================= Velocity =============================

class Velocity {
    private vx: number;
    private vy: number;

    constructor(x: number, y: number) {
        this.vx = x;
        this.vy = y;
    }

    public InvertVx() {
        this.vx = -this.vx;
    }

    public InvertVy() {
        this.vy = -this.vy;
    }

    public get VX(): number {
        return this.vx;
    }

    public get VY(): number {
        return this.vy;
    }

    public AddToVX(num: number) {
        this.vx += num;
    }

    public AddToVY(num: number) {
        this.vy += num;
    }

    public SubFromVX(num: number) {
        this.AddToVX(-num);
    }

    public SubFromVY(num: number) {
        this.AddToVY(-num);
    }

    public toString(): string {
        return `(VX: ${this.VX}; VY: ${this.VY})`

    }

}

// ============================= Position =============================

class Postition {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public DistanceFrom(other_pos: Postition) {
        return Math.sqrt(Math.pow(this.X - other_pos.X, 2) + Math.pow(this.Y - other_pos.Y, 2))
    }

    public get X(): number {
        return this.x;
    }

    public get Y(): number {
        return this.y;
    }

    public set X(value: number) {
        this.x = value;
    }

    public set Y(value: number) {
        this.y = value;
    }

    public AddToX(num: number) {
        this.x += num;
    }

    public AddToY(num: number) {
        this.y += num;
    }

    public SubFromX(num: number) {
        this.AddToX(-num);
    }

    public SubFromY(num: number) {
        this.AddToY(-num);
    }

    public toString(): string {
        return `(X: ${this.X}; Y: ${this.Y})`

    }

    public isEquals(position: Postition) {
        return (this.X == position.X) && (this.Y == position.Y);
    }

}

// ============================= Body =============================

class Body {
    private position: Postition;
    private velocity: Velocity;
    private mass: number;
    private radius: number;
    private color: Color;

    constructor(x: number, y: number, vx: number, vy: number, mass: number, color: Color, radius: number) {
        this.position = new Postition(x, y);
        this.velocity = new Velocity(vx, vy);
        this.mass = mass;
        this.radius = radius;
        this.color = color;
    }
    public get Mass() {
        return this.mass;
    }
    public set Mass(value: number) {
        this.mass = value;
    }
    public get Radius() {
        return this.radius;
    }
    public set Radius(value: number) {
        this.radius = value;
    }
    public get Color() {
        return this.color;
    }
    public set Color(value: Color) {
        this.color = value;
    }
    public get Position() {
        return this.position;
    }

    public GetCenterPosition(): Postition {
        return new Postition(this.Position.X + this.radius / 2, this.Position.Y + this.radius / 2)
    }

    public toString(): string {
        return `Body {Starting Position: ${this.Position.toString()}, Starting Velocity: ${this.Velocity.toString()}, Mass: ${this.Mass.toString()}, Radius: ${this.radius}, Color: ${this.color.toString()}}`
    }

    public get Velocity() {
        return this.velocity;
    }
    OffsetVelocity(dvx: number, dvy: number) {
        this.velocity.AddToVX(dvx);
        this.velocity.AddToVY(dvy);
    }
    OffsetPosition(dx: number, dy: number) {
        this.position.AddToX(dx);
        this.position.AddToY(dy);
    }
}

// ============================= Color =============================

class Color {
    private red: number;
    public get Red(): number {
        return this.red;
    }
    public set Red(value: number) {

        this.red = value % 256;

    }
    private green: number;
    public get Green(): number {
        return this.green;
    }
    public set Green(value: number) {

        this.green = value % 256;

    }
    private blue: number;
    public get Blue(): number {
        return this.blue;
    }
    public set Blue(value: number) {

        this.blue = value % 256;
    }
    private alpha: number;
    public get Alpha(): number {
        return this.alpha;
    }
    public set Alpha(value: number) {
        this.alpha = value;
    }

    public toString(): string {
        return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`
    }

    static GenerateRandomColor(): Color {
        return new Color(GenerateRandomNumber(0, 255), GenerateRandomNumber(0, 255), GenerateRandomNumber(0, 255))
    }

    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = 1.0;
    }
}

// ============================= Common functions =============================

function GenerateRandomNumber(min: number, max: number): number {
    if (max >= min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        throw new RangeError("ERROR! Minimum number must be smaller or equal to maximum number!");
    }
}

// ============================= Main =============================

const G: number = 6.673e-11;
const base_mass = 500000;
const default_mass = 5 * base_mass;
const min_mass: number = 1 * base_mass;
const max_mass: number = 20 * base_mass;
const black_hole_mass = 75 * base_mass;

const trails_input = <HTMLInputElement>document.getElementById("enable_trails");
const auto_reset_input = <HTMLInputElement>document.getElementById("auto_reset");
const body_size_input = <HTMLInputElement>document.getElementById("body_size");
const time_flow_input = <HTMLInputElement>document.getElementById("time_flow");
const body_number_input = <HTMLInputElement>document.getElementById("body_number");
const random_mass_input = <HTMLInputElement>document.getElementById("random_mass");
const connect_dots_input = <HTMLInputElement>document.getElementById("connect_dots");
const starting_velocity_multiplier_input = <HTMLInputElement>document.getElementById("starting_velocity_multiplier");
const wrap_input = <HTMLInputElement>document.getElementById("wrap");

let starting_velocity_multiplier = Number.parseInt(starting_velocity_multiplier_input.value);
let body_size = Number.parseInt(body_size_input.value);
let time_flow = Number.parseInt(time_flow_input.value);
let draw_trails: boolean = trails_input.checked;
let auto_reset: boolean = auto_reset_input.checked;
let connect_dots: boolean = connect_dots_input.checked;
let wrap_dots: boolean = wrap_input.checked;
let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas_id");
canvas.width = screen.width;
canvas.height = screen.height;
let canvasWidth: number = canvas.width;
let canvasHeight: number = canvas.height;
let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
let body_array: Body[] = [];
let out_of_bounds_counter = 0;
let requiredElapsed = 1000 / time_flow;
ctx.lineWidth = body_size * 2;
let delta = 0;
main();

async function main() {
    ResetEverything();

    let lastTime = 0;

    requestAnimationFrame(loop);

    function loop(now: number) {
        requestAnimationFrame(loop);

        if (!lastTime) { lastTime = now; }
        const elapsed = now - lastTime;

        if (elapsed > requiredElapsed) {
            delta = elapsed / 1000;
            for (let i = 0; i < body_array.length; i++) {
                for (let j = i; j < body_array.length; j++) {
                    if (i != j) {
                        CalculateForce(body_array[i], body_array[j]);
                    }
                }
            }

            if (!draw_trails) {
                ClearCanvas();
            }

            UpdateBodies(delta);
            DrawBodies();

            out_of_bounds_counter = 0;

            lastTime = now;
        }
    }

    loop(0);
}

// Put initial starting state here
function Setup() {

}

function TrailsChange() {
    draw_trails = trails_input.checked;
}

function LineDotsChange() {
    connect_dots = connect_dots_input.checked;
}

function StartingVelocityMultiplierChange() {
    starting_velocity_multiplier = Number.parseInt(starting_velocity_multiplier_input.value);;
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
    ctx.lineWidth = body_size * 2;
}

function TimeChange() {
    time_flow = Number.parseInt(time_flow_input.value);
    requiredElapsed = 1000 / time_flow;
}

function WrapChange() {
    wrap_dots = wrap_input.checked;
}

function InputChanged() {
    ResetCanvas()
    console.clear();
    console.log("Generating new bodies!");
    for (let index = 0; index < Number.parseInt(body_number_input.value); index++) {
        let x: number = Math.floor(GenerateRandomNumber(canvasWidth * 0.15, canvasWidth * 0.85));
        let y: number = Math.floor(GenerateRandomNumber(canvasHeight * 0.15, canvasHeight * 0.85));

        let vx: number = Number(((Math.random() * Math.floor(Math.random() * (3)) - 1) * starting_velocity_multiplier).toFixed(2));
        let vy: number = Number(((Math.random() * Math.floor(Math.random() * (3)) - 1) * starting_velocity_multiplier).toFixed(2));

        let color: Color = Color.GenerateRandomColor();
        let mass: number = default_mass;
        if (random_mass_input.checked) {
            mass = GenerateRandomNumber(min_mass, max_mass);
            if (color.Red == 0 && color.Green == 0 && color.Blue == 0) {
                mass = black_hole_mass;
            }
        }
        let new_body = new Body(x, y, vx, vy, mass, color, body_size);
        console.log(new_body.toString());
        body_array.push(new_body);
    }
    DrawBodies();
    Setup();
}

function ResetEverything() {
    InputChanged();
}

function DrawLine(line_starting_coordinate: Postition, line_ending_coordinate: Postition, color: Color, width: number) {
    ctx.beginPath();
    ctx.strokeStyle = `rgb(${color.Red},${color.Green},${color.Blue},${color.Alpha})`;
    ctx.lineWidth = width;
    ctx.moveTo(line_starting_coordinate.X, line_starting_coordinate.Y);
    ctx.lineTo(line_ending_coordinate.X, line_ending_coordinate.Y);
    ctx.stroke();
}

function DrawDot(position: Postition, color: Color, radius: number) {
    ctx.beginPath();
    ctx.fillStyle = `rgb(${color.Red},${color.Green},${color.Blue},${color.Alpha})`;
    ctx.arc(position.X, position.Y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function DrawBody(body: Body) {
    if (ctx != null) {

        if (isBodyOnScreen(body)) {
            if (connect_dots) {
                let previous_position = new Postition(body.Position.X - body.Velocity.VX * delta, body.Position.Y - body.Velocity.VY * delta);
                if (!draw_trails) {
                    DrawDot(previous_position, body.Color, body.Radius);
                }
                DrawLine(previous_position, body.Position, body.Color, body.Radius * 2);
            }
            DrawDot(body.Position, body.Color, body.Radius);
        } else {
            if (auto_reset) {
                out_of_bounds_counter++;
                if (out_of_bounds_counter == body_array.length) {
                    ResetEverything();
                }
            }
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function DrawBodies() {
    body_array.forEach(body => {
        DrawBody(body)
    });
}

function CalculateForce(body1: Body, body2: Body) {

    let distance: number = body1.GetCenterPosition().DistanceFrom(body2.Position);
    let force: number = (G * body1.Mass * body2.Mass * distance) / Math.pow(Math.abs(distance), 3);
    let delta_x = (body2.GetCenterPosition().X - body1.GetCenterPosition().X) * force;
    let delta_y = (body2.GetCenterPosition().Y - body1.GetCenterPosition().Y) * force;
    body1.Velocity.AddToVX(delta_x);
    body1.Velocity.AddToVY(delta_y);
    body2.Velocity.AddToVX(-delta_x);
    body2.Velocity.AddToVY(-delta_y);

}

function UpdateBodies(delta: number) {
    body_array.forEach(body => {
        body.Position.AddToX(body.Velocity.VX * delta);
        body.Position.AddToY(body.Velocity.VY * delta);
        if (wrap_dots) {
            if (!isBodyOnScreen(body)) {
                if (body.Position.X < 0) {
                    body.Position.X = canvasWidth;
                }
                if (body.Position.X > canvasWidth) {
                    body.Position.X = 0;
                }
                if (body.Position.Y < 0) {
                    body.Position.Y = canvasHeight;
                }
                if (body.Position.Y > canvasHeight) {
                    body.Position.Y = 0;
                }
            }
        }
    });
}

function Reset() {
    ResetEverything();
}

function isBodyOnScreen(body: Body): boolean {
    return body.Position.X >= 0 && body.Position.X <= canvasWidth && body.Position.Y >= 0 && body.Position.Y <= canvasHeight;
}

window.onresize = () => {
    canvas.width = screen.width;
    canvas.height = screen.height;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx.lineWidth = body_size * 2;
}