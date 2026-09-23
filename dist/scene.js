import * as THREE from './assets/three.module.min.js';
const host=document.getElementById('aura');
const button=document.getElementById('motion-toggle');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
let visible=true;
let raf=0;
let renderer;
try{
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.setClearColor(0x000000,0);
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,1,0.1,30);camera.position.z=7;
  const group=new THREE.Group();scene.add(group);
  const geometry=new THREE.BufferGeometry();
  const count=44;const positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*7;positions[i*3+1]=(Math.random()-.5)*8;positions[i*3+2]=(Math.random()-.5)*3;}
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const material=new THREE.PointsMaterial({color:0xfff0d9,size:.025,transparent:true,opacity:.4,depthWrite:false});
  const points=new THREE.Points(geometry,material);group.add(points);
  const ringMaterial=new THREE.MeshBasicMaterial({color:0xf7dcc0,transparent:true,opacity:.14,depthWrite:false});
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.65,.006,6,120),ringMaterial);ring.rotation.x=.5;ring.rotation.y=.6;ring.position.x=.8;group.add(ring);
  let pointerX=0,pointerY=0,phase=0,last=0;
  function resize(){const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.render(scene,camera);}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  host.parentElement.addEventListener('pointermove',event=>{const r=host.getBoundingClientRect();pointerX=(event.clientX-r.left)/r.width-.5;pointerY=(event.clientY-r.top)/r.height-.5;});
  function frame(time){raf=0;if(paused||!visible||document.hidden)return;const delta=Math.min((time-last)/1000,.05);last=time;phase+=delta;points.rotation.z=phase*.012;points.position.y=Math.sin(phase*.15)*.1;ring.rotation.z=phase*.04;group.rotation.y+=(pointerX*.08-group.rotation.y)*.025;group.rotation.x+=(-pointerY*.06-group.rotation.x)*.025;renderer.render(scene,camera);raf=requestAnimationFrame(frame);}
  function update(){button.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';button.setAttribute('aria-label',paused?'Play decorative animation':'Pause decorative animation');button.setAttribute('aria-pressed',String(paused));if(raf)cancelAnimationFrame(raf);raf=0;if(!paused&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame);}else renderer.render(scene,camera);}
  button.addEventListener('click',()=>{paused=!paused;update();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;update();});
  document.addEventListener('visibilitychange',update);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();});observer.observe(host);
  resize();update();
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(raf);button.hidden=true;host.hidden=true;});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);resizeObserver.disconnect();observer.disconnect();geometry.dispose();material.dispose();ring.geometry.dispose();ringMaterial.dispose();renderer.dispose();},{once:true});
}catch{if(renderer)renderer.dispose();host.hidden=true;button.hidden=true;}
