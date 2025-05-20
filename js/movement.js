let velocity = 0;
let moveVelX = 0;
let moveVelZ = 0;

const GRAVITY = 0.004;
const THRUST_FORCE = 0.008;
const MAX_VELOCITY = 0.2;
const MOVE_ACCEL = 0.002;
const MOVE_DECEL = 0.001;
const MAX_MOVE_SPEED = 0.2;
const MAX_HEIGHT = 2;
const GROUND_FRICTION = 0.15;

function updateMovement() {
    updateVerticalMovement();
    updateHorizontalMovement();
}

function updateVerticalMovement() {
    if (isFlying && cube.position.y < MAX_HEIGHT) {
        velocity += THRUST_FORCE;
    }
    velocity -= GRAVITY;
    velocity = Math.min(Math.max(velocity, -MAX_VELOCITY), MAX_VELOCITY);
    cube.position.y = Math.min(Math.max(cube.position.y + velocity, 1), MAX_HEIGHT);

    if (cube.position.y <= 1) {
        velocity = 0;
    }
}

function updateHorizontalMovement() {
    if (cube.position.y > 1) {
        applyAirControls();
    } else {
        applyGroundFriction();
    }
    
    moveVelX = Math.max(Math.min(moveVelX, MAX_MOVE_SPEED), -MAX_MOVE_SPEED);
    moveVelZ = Math.max(Math.min(moveVelZ, MAX_MOVE_SPEED), -MAX_MOVE_SPEED);
    
    cube.position.x += moveVelX;
    cube.position.z += moveVelZ;
}
