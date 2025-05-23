// Simple Perlin Noise implementation (Ken Perlin's improved noise)
const Perlin = {
    grad3: [
        [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
        [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
        [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ],
    p: [],
    perm: [],
    init: function() {
        this.p = [];
        for (let i=0; i<256; i++) this.p[i] = Math.floor(Math.random()*256);
        this.perm = [];
        for(let i=0; i<512; i++) this.perm[i]=this.p[i & 255];
    },
    dot: function(g, x, y) { return g[0]*x + g[1]*y; },
    noise: function(xin, yin) {
        let grad3 = this.grad3, perm = this.perm;
        let F2 = 0.5*(Math.sqrt(3.0)-1.0);
        let s = (xin+yin)*F2;
        let i = Math.floor(xin+s);
        let j = Math.floor(yin+s);
        let G2 = (3.0-Math.sqrt(3.0))/6.0;
        let t = (i+j)*G2;
        let X0 = i-t, Y0 = j-t;
        let x0 = xin-X0, y0 = yin-Y0;
        let i1, j1;
        if(x0>y0){i1=1;j1=0;} else {i1=0;j1=1;}
        let x1 = x0-i1+G2, y1 = y0-j1+G2;
        let x2 = x0-1.0+2.0*G2, y2 = y0-1.0+2.0*G2;
        let ii = i & 255, jj = j & 255;
        let gi0 = perm[ii+perm[jj]] % 12;
        let gi1 = perm[ii+i1+perm[jj+j1]] % 12;
        let gi2 = perm[ii+1+perm[jj+1]] % 12;
        let t0 = 0.5 - x0*x0-y0*y0;
        let n0 = t0<0 ? 0.0 : (t0 *= t0, t0 * t0 * this.dot(grad3[gi0], x0, y0));
        let t1 = 0.5 - x1*x1-y1*y1;
        let n1 = t1<0 ? 0.0 : (t1 *= t1, t1 * t1 * this.dot(grad3[gi1], x1, y1));
        let t2 = 0.5 - x2*x2-y2*y2;
        let n2 = t2<0 ? 0.0 : (t2 *= t2, t2 * t2 * this.dot(grad3[gi2], x2, y2));
        return 70.0 * (n0 + n1 + n2);
    }
};
Perlin.init();

let plane;

function setupTerrain() {
    const width = 50, height = 50, segments = 100;
    const planeGeometry = new THREE.PlaneGeometry(width, height, segments, segments);

    // Displace vertices using Perlin noise.
    // scale = 0.15 amp = 4
    const scale = 0.10, amplitude = 2;
    for (let i = 0; i < planeGeometry.attributes.position.count; i++) {
        const x = planeGeometry.attributes.position.getX(i);
        const y = planeGeometry.attributes.position.getY(i);
        const noise = Perlin.noise(x * scale, y * scale);
        planeGeometry.attributes.position.setZ(i, noise * amplitude);
    }
    planeGeometry.computeVertexNormals();

    // Color each face (triangle) based on average height
    const colors = [];
    const pos = planeGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        colors.push(0, 0, 0); // placeholder
    }
    // For each face (triangle), set color for its 3 vertices
    const color = new THREE.Color();
    for (let i = 0; i < planeGeometry.index.count; i += 3) {
        const a = planeGeometry.index.getX(i);
        const b = planeGeometry.index.getX(i+1);
        const c = planeGeometry.index.getX(i+2);
        const ha = pos.getZ(a), hb = pos.getZ(b), hc = pos.getZ(c);
        const h = (ha + hb + hc) / 3;
        // Map height to green shade
        color.setHSL(0.33, 1, 0.25 + 0.25 * (h / amplitude + 0.5));
        colors[a*3] = color.r; colors[a*3+1] = color.g; colors[a*3+2] = color.b;
        colors[b*3] = color.r; colors[b*3+1] = color.g; colors[b*3+2] = color.b;
        colors[c*3] = color.r; colors[c*3+1] = color.g; colors[c*3+2] = color.b;
    }
    planeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const planeMaterial = new THREE.MeshLambertMaterial({ vertexColors: true }); //, side: THREE.DoubleSide
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(width, segments);
    scene.add(gridHelper);
}
