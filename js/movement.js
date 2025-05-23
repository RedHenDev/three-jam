let velocity = 0;
let moveVelX = 0;
let moveVelZ = 0;

const GRAVITY = 0.004;
const THRUST_FORCE = 0.006; // 0.008
const MAX_VELOCITY = 0.2;
const MOVE_ACCEL = 0.002;
const MOVE_DECEL = 0.04; // 0.001
const MAX_MOVE_SPEED = 0.2;
const MAX_HEIGHT = 4;
const GROUND_FRICTION = 0.15;
const GROUND_OFFSET = 0.4;

// Use the same scale and amplitude as in terrain.js
const TERRAIN_SCALE = 0.10;
const TERRAIN_AMPLITUDE = 2;

// Helper to get terrain height at (x, y)
function getTerrainHeight(x, z) {
    // Perlin.noise expects (x, y) in plane coordinates
    return Perlin.noise(x * TERRAIN_SCALE, -z * TERRAIN_SCALE) * TERRAIN_AMPLITUDE;
}

function updateMovement() {
    //updateVerticalMovement();
    updateHorizontalMovement();
}

function updateVerticalMovement() {
    const groundY = GROUND_OFFSET + 
    getTerrainHeight(   cube.position.x, 
                        cube.position.z);
    if (isFlying && cube.position.y < MAX_HEIGHT) {
        
        // Let's diminish THRUST_FORCE
        // relative to proximity to MAX_HEIGHT.
        const adjusted_thrust =
            THRUST_FORCE * 
            (MAX_HEIGHT/cube.position.y);
        
        velocity += adjusted_thrust;
    }
    velocity -= GRAVITY;
    velocity = Math.min(Math.max(velocity, -MAX_VELOCITY), MAX_VELOCITY);
    cube.position.y = Math.min(Math.max(cube.position.y + velocity, groundY), 12);

    if (cube.position.y <= groundY) {
        velocity = 0;
    }
}

function updateHorizontalMovement() {
    const groundY = GROUND_OFFSET + getTerrainHeight(cube.position.x, cube.position.z);
    // if (cube.position.y > groundY) {
    //     applyAirControls();
    // } else {
    //     applyGroundFriction();
    //     // Only snap to ground if you want to force the cube to stick to terrain (e.g., in a test mode)
    //     // Otherwise, let updateVerticalMovement handle y-position.
    //     cube.position.y = groundY; // <-- REMOVE or COMMENT OUT this line
    // }

    // For testing collisions of terrain.
    applyAirControls();
    cube.position.y = groundY;

    moveVelX = Math.max(Math.min(moveVelX, MAX_MOVE_SPEED), -MAX_MOVE_SPEED);
    moveVelZ = Math.max(Math.min(moveVelZ, MAX_MOVE_SPEED), -MAX_MOVE_SPEED);
    
    cube.position.x += moveVelX;
    cube.position.z += moveVelZ;
}