const keysPressed = {};
let isFlying = false;

function setupControls() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
}

function onKeyDown(event) {
    keysPressed[event.code] = true;
    if (event.code === 'Space') {
        isFlying = true;
    }
    if (event.code === 'KeyF') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

function onKeyUp(event) {
    keysPressed[event.code] = false;
    if (event.code === 'Space') {
        isFlying = false;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function applyAirControls() {
    if (keysPressed['ArrowLeft'] || keysPressed['KeyA']) moveVelX += MOVE_ACCEL;
    if (keysPressed['ArrowRight'] || keysPressed['KeyD']) moveVelX -= MOVE_ACCEL;
    if (keysPressed['ArrowUp'] || keysPressed['KeyW']) moveVelZ += MOVE_ACCEL;
    if (keysPressed['ArrowDown'] || keysPressed['KeyS']) moveVelZ -= MOVE_ACCEL;

    moveVelX *= (1 - MOVE_DECEL);
    moveVelZ *= (1 - MOVE_DECEL);
}

function applyGroundFriction() {
    moveVelX *= (1 - GROUND_FRICTION);
    moveVelZ *= (1 - GROUND_FRICTION);
}
