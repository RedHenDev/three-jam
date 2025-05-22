let plane;

function setupTerrain() {
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x208020, 
        side: THREE.DoubleSide 
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;  // This aligns with our top-down view
    plane.receiveShadow = true;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(50, 50);
    gridHelper.position.y = -0.01; // Slightly below plane to avoid z-fighting
    scene.add(gridHelper);
}
