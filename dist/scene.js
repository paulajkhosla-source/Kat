import * as THREE from './assets/three.module.min.js';

const host = document.getElementById('aura');
const stage = document.querySelector('.hero-visual');
const motionButton = document.getElementById('motion-toggle');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
let renderer, animation = 0, visible = true, phase = 0, previous = 0;
let drag = false, lastX = 0, targetRotation = 0, rotation = 0;
const materials = [], geometries = [];

function showFallback() {
  host.hidden = true;
  stage.classList.add('scene-fallback');
  document.querySelector('.scene-instruction').innerHTML = 'DRAG TO DISCOVER <span>↔</span>';
  let fallbackAngle = 0, pointer = null;
  const fallback = document.querySelector('.fallback-rotation');
  stage.addEventListener('pointerdown',event=>{if(!event.target.closest('button'))pointer=event.clientX;});
  stage.addEventListener('pointermove',event=>{if(pointer===null)return;fallbackAngle+=(event.clientX-pointer)*.6;pointer=event.clientX;fallback.style.transform=`rotateY(${fallbackAngle}deg)`;});
  const stop=()=>pointer=null;window.addEventListener('pointerup',stop);stage.addEventListener('pointercancel',stop);stage.addEventListener('pointerleave',stop);
  stage.addEventListener('keydown',event=>{if(event.target===stage&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();fallbackAngle+=event.key==='ArrowLeft'?-20:20;fallback.style.transform=`rotateY(${fallbackAngle}deg)`;}});
  const colors = {silver:'#bfc2c5',graphite:'#414448',pearl:'#f0f0ed'};
  document.querySelectorAll('[data-scene-color]').forEach(button=>button.addEventListener('click',()=>{stage.style.setProperty('--fallback-metal',colors[button.dataset.sceneColor]);document.querySelectorAll('[data-scene-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
  motionButton.textContent = paused ? 'Play motion ▷' : 'Pause motion Ⅱ';
}
function syncMotion() {
  document.documentElement.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  motionButton.textContent = paused ? 'Play motion ▷' : 'Pause motion Ⅱ';
}
motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); restart(); });
reduced.addEventListener('change', () => { paused = reduced.matches; syncMotion(); restart(); });
function restart() {
  cancelAnimationFrame(animation);
  if (renderer && !paused && visible && !document.hidden) {
    previous = performance.now();
    animation = requestAnimationFrame(render);
  }
}
let render = () => {};
syncMotion();
try {
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 60);
  camera.position.set(0, 0, 10.3);

  // An actual three-dimensional light studio, reflected in the sculpture.
  const room = new THREE.Scene();
  room.background = new THREE.Color('#1b1b1b');
  const panelGeometry = new THREE.PlaneGeometry(1, 1);
  geometries.push(panelGeometry);
  function panel(color, intensity, x, y, z, sx, sy, rotationY = 0) {
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    mat.color.multiplyScalar(intensity); materials.push(mat);
    const mesh = new THREE.Mesh(panelGeometry, mat);
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, 1); mesh.rotation.y = rotationY; room.add(mesh);
  }
  panel('#f7f7f7', 5, -4, 1, 3, 2, 8, .55);
  panel('#e7e7e7', 4, 4, 1, 2, 1.5, 7, -.6);
  panel('#ffffff', 3, 0, 5, 0, 8, 3, 0);
  panel('#adadad', 2, 0, -2, -5, 7, 4, 0);
  panel('#f1f1f1', 2, -1, 0, 6, .4, 6, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .055, .1, 40);
  scene.environment = environment.texture;
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf5f5f5, 0x242424, 2));
  const light = new THREE.DirectionalLight(0xe4e4e4, 4); light.position.set(-3, 5, 6); scene.add(light);
  const rim = new THREE.DirectionalLight(0xc2c2c2, 3); rim.position.set(4, -1, 2); scene.add(rim);

  const sculpture = new THREE.Group();
  sculpture.rotation.set(.22, -.3, -.28);
  scene.add(sculpture);
  const silver = new THREE.MeshPhysicalMaterial({color:0xbfc2c5, metalness:.93, roughness:.17, clearcoat:1, clearcoatRoughness:.08, envMapIntensity:1.4});
  const pearl = new THREE.MeshPhysicalMaterial({color:0xf1f1f1, metalness:.25, roughness:.14, clearcoat:1, iridescence:.2, iridescenceIOR:1.3, envMapIntensity:1.2});
  const chrome = new THREE.MeshPhysicalMaterial({color:0xcbcbcb, metalness:1, roughness:.2, envMapIntensity:1.8});
  materials.push(silver, pearl, chrome);
  const ribbonGeometry = new THREE.TorusKnotGeometry(1.38, .44, 190, 28, 2, 3);
  geometries.push(ribbonGeometry);
  const ribbon = new THREE.Mesh(ribbonGeometry, silver);
  sculpture.add(ribbon);
  const centerGeometry = new THREE.SphereGeometry(.57, 40, 28);
  geometries.push(centerGeometry);
  const center = new THREE.Mesh(centerGeometry, pearl);
  center.position.set(.1,.1,.9); sculpture.add(center);
  const orbitGeometry = new THREE.TorusGeometry(2.3, .013, 8, 150);
  geometries.push(orbitGeometry);
  const orbit = new THREE.Mesh(orbitGeometry, chrome);
  orbit.rotation.set(1.05,.3,-.4); sculpture.add(orbit);
  const orbit2 = new THREE.Mesh(orbitGeometry, chrome);
  orbit2.scale.setScalar(1.13); orbit2.rotation.set(.2,1.1,.6); sculpture.add(orbit2);
  const sphereGeometry = new THREE.SphereGeometry(1, 28, 20);
  geometries.push(sphereGeometry);
  const satellites = [];
  for (let i=0; i<5; i++) {
    const mesh = new THREE.Mesh(sphereGeometry, i%2 ? chrome : pearl);
    mesh.scale.setScalar([.21,.14,.32,.11,.18][i]);
    scene.add(mesh); satellites.push(mesh);
  }
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(90*3);
  for(let i=0;i<90;i++) { dustPositions[i*3]=(Math.random()-.5)*11; dustPositions[i*3+1]=(Math.random()-.5)*9; dustPositions[i*3+2]=-2-Math.random()*4; }
  dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3)); geometries.push(dustGeometry);
  const dustMaterial = new THREE.PointsMaterial({color:0xcdcdcd,size:.025,transparent:true,opacity:.6,depthWrite:false});materials.push(dustMaterial);
  const dust = new THREE.Points(dustGeometry,dustMaterial);scene.add(dust);
  const colors = {silver:'#bfc2c5',graphite:'#414448',pearl:'#f0f0ed'};
  let targetColor = new THREE.Color(colors.silver), pointerX = 0, pointerY = 0;
  let width = 1, height = 1;
  function draw() {
    const reducedTime = paused ? 0 : phase;
    rotation += (targetRotation-rotation)*.07;
    sculpture.rotation.y = -.3 + reducedTime*.3 + rotation + pointerX*.13;
    sculpture.rotation.x = .22 + Math.sin(reducedTime*.45)*.16 + pointerY*.09;
    sculpture.rotation.z = -.28 + Math.sin(reducedTime*.26)*.12;
    sculpture.position.y = Math.sin(reducedTime*.65)*.14;
    orbit.rotation.z = -.4 + reducedTime*.12;
    orbit2.rotation.z = .6 - reducedTime*.16;
    silver.color.lerp(targetColor, paused ? 1 : .055);
    satellites.forEach((sphere,i) => {
      const angle = i*Math.PI*2/5 + reducedTime*(i%2 ? -.19 : .23);
      sphere.position.set(Math.cos(angle)*(2.6+i*.08),Math.sin(angle)*(2.5+i*.08),Math.sin(angle*.8)*1.2);
    });
    dust.rotation.z = reducedTime*.025;
    renderer.render(scene,camera);
  }
  function resize() {
    const rect = host.getBoundingClientRect();
    width=rect.width; height=rect.height;
    if (!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;
    camera.position.z=camera.aspect<.8 ? 12.5 : 10.3;camera.updateProjectionMatrix();draw();
  }
  render = time => {
    if(paused||!visible||document.hidden)return;
    const dt=Math.min((time-previous)/1000,.05);previous=time;phase+=dt;draw();animation=requestAnimationFrame(render);
  };
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag=true;lastX=e.clientX;stage.classList.add('is-dragging');});
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;if(drag){targetRotation+=(e.clientX-lastX)*.013;lastX=e.clientX;if(paused){rotation=targetRotation;draw();}}});
  const release=()=>{drag=false;stage.classList.remove('is-dragging');};
  window.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('pointerleave',release);
  stage.addEventListener('keydown',e=>{if(e.target!==stage)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();targetRotation+=e.key==='ArrowLeft'?-.3:.3;if(paused){rotation=targetRotation;draw();}}});
  document.querySelectorAll('[data-scene-color]').forEach(button=>button.addEventListener('click',()=>{targetColor.set(colors[button.dataset.sceneColor]);document.querySelectorAll('[data-scene-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));if(paused)draw();}));
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();});visibility.observe(host);
  document.addEventListener('visibilitychange',restart);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(animation);showFallback();});
  stage.classList.add('scene-ready');resize();restart();
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(animation);resizeObserver.disconnect();visibility.disconnect();environment.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();});
}catch(error){console.warn('WebGL unavailable; using CSS 3D sculpture.',error);showFallback();}
