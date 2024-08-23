let scene, camera, renderer, cube;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282828); // Match your background color

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('animation-container').appendChild(renderer.domElement);

    // Create cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xd79921 }); // Use your yellow color
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize the animation when the window loads
window.onload = init;
