'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function heartGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -.94);
  shape.bezierCurveTo(-.27, -.58, -1.02, -.1, -1.02, .4);
  shape.bezierCurveTo(-1.02, 1.08, -.3, 1.22, 0, .66);
  shape.bezierCurveTo(.3, 1.22, 1.02, 1.08, 1.02, .4);
  shape.bezierCurveTo(1.02, -.1, .27, -.58, 0, -.94);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: .16, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: .09, bevelThickness: .09, curveSegments: 32 });
  geometry.center();
  return geometry;
}

function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,220,244,1)');
  gradient.addColorStop(.16, 'rgba(255,111,201,.8)');
  gradient.addColorStop(.5, 'rgba(246,49,154,.2)');
  gradient.addColorStop(1, 'rgba(230,38,172,0)');
  context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export default function Charm() {
  const host = useRef<HTMLDivElement>(null);
  const castAt = useRef(-10000);
  const motion = useRef(true);
  const busy = useRef(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [casting, setCasting] = useState(false);
  const [reduced, setReduced] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = host.current; if (!el) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    motion.current = !preference.matches; setPaused(preference.matches); setReduced(preference.matches);
    const preferenceChanged = () => { motion.current = !preference.matches; setPaused(preference.matches); setReduced(preference.matches); };
    preference.addEventListener('change', preferenceChanged);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { setFallback(true); setReady(true); preference.removeEventListener('change', preferenceChanged); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 50); camera.position.set(0, .1, 8);
    const effect = new THREE.Group(); scene.add(effect);
    const geometry = heartGeometry();
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uOpacity: { value: 1 }, uPulse: { value: 0 } },
      vertexShader: `varying vec3 vNormal; varying vec3 vView; varying vec3 vPosition;
        void main(){ vec4 mv=modelViewMatrix*vec4(position,1.);vPosition=position;vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vNormal; varying vec3 vView; varying vec3 vPosition; uniform float uOpacity; uniform float uPulse;
        void main(){ float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),1.3);
        float core=pow(max(0.,1.-length(vPosition.xy*vec2(.82,.7))),.65);
        vec3 color=mix(vec3(.96,.04,.42),vec3(1.,.65,.87),core*.95);
        color=mix(color,vec3(1.,.85,.98),rim*.9);color+=uPulse*.09;
        gl_FragColor=vec4(color,uOpacity); }`,
    });
    const heart = new THREE.Mesh(geometry, material); effect.add(heart);
    const outline = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#ff75cf', transparent: true, opacity: .1, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })); outline.scale.setScalar(1.09); heart.add(outline);
    const texture = glowTexture();
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: '#f885d3', transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false }));
    aura.scale.set(5, 5, 1); aura.position.z = -.2; heart.add(aura);
    const ghosts: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshBasicMaterial>[] = [];
    for (let i = 0; i < 7; i++) {
      const ghost = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: i % 2 ? '#ec63df' : '#ff9ada', transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false }));
      ghost.scale.setScalar(.1 + (6-i)*.033); effect.add(ghost); ghosts.push(ghost);
    }
    const ribbons: {mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>; positions: Float32Array; index: number}[] = [];
    for(let index = 0; index < 3; index++) {
      const positions = new Float32Array(44*2*3); const indices: number[] = [];
      for(let i=0;i<43;i++){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geo.setIndex(indices);
      const mesh = new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:index===1?'#ffb2e4':'#e765d0',transparent:true,opacity:.2,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));
      mesh.frustumCulled=false;effect.add(mesh);ribbons.push({mesh,positions,index});
    }
    const particles = new THREE.Group(); scene.add(particles);
    const sparks: THREE.Sprite[] = [];
    for(let i=0;i<26;i++){
      const spark=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:i%2?'#ff9dd9':'#d190ff',transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));
      spark.scale.setScalar(.08+(i%4)*.025);particles.add(spark);sparks.push(spark);
    }
    const ring = new THREE.Mesh(new THREE.RingGeometry(.95,1,96),new THREE.MeshBasicMaterial({color:'#ff9fdd',transparent:true,opacity:0,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(ring);
    const intersection = new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??true;},{rootMargin:'100px'});
    let inView=true;intersection.observe(el);
    const resize = () => {const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    let pointerX=0,pointerY=0,time=0,last=performance.now(),frame=0;
    const pointer=(e:PointerEvent)=>{const bounds=el.getBoundingClientRect();pointerX=((e.clientX-bounds.left)/bounds.width-.5)*.5;pointerY=((e.clientY-bounds.top)/bounds.height-.5)*.3;};
    const leave=()=>{pointerX=pointerY=0;};el.addEventListener('pointermove',pointer);el.addEventListener('pointerleave',leave);
    const render = (now:number) => {
      frame=requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.05);last=now;
      if(document.hidden||!inView)return;
      if(motion.current)time+=dt;
      const elapsed=(now-castAt.current)/1000;const active=elapsed>=0&&elapsed<1.65&&!preference.matches;
      let x=.6,y=Math.sin(time*1.5)*.07,z=0,scale=.83,opacity=1,impact=0;
      if(active){
        if(elapsed<.22){const p=elapsed/.22;x=.6-p*.5;scale=.83+p*.09;}
        else if(elapsed<1.1){const p=(elapsed-.22)/.88;const ease=1-Math.pow(1-p,1.5);x=.1+ease*2.7;y=.1*Math.sin(p*Math.PI);z=ease*.9;scale=.92-p*.2;}
        else{impact=(elapsed-1.1)/.55;x=2.8;z=.9;opacity=0;}
      }
      effect.position.set(x,y,z);heart.visible=opacity>0;heart.scale.setScalar(scale);
      heart.rotation.set(pointerY*.35,Math.sin(time*.65)*.12+pointerX*.4,Math.sin(time*.8)*.035);
      material.uniforms.uPulse.value=.4+.4*Math.sin(time*2.2);material.uniforms.uOpacity.value=opacity;
      aura.material.opacity=.45+.1*Math.sin(time*2);
      for(let i=0;i<ghosts.length;i++){
        const g=ghosts[i],distance=.65+i*.35;g.position.set(-distance,Math.sin(time*2-distance*2.8)*(.1+i*.018),-.1);
        g.rotation.z=Math.sin(time+i)*.15;g.material.opacity=(.33-i*.036)*opacity;
      }
      for(const ribbon of ribbons){
        for(let i=0;i<44;i++){
          const p=i/43;const offset=(1-p)*3.05;const centerY=Math.sin(offset*2.4-time*3+ribbon.index*1.5)*.11+Math.sin(offset*1.3+ribbon.index)*.06;
          const width=Math.sin(p*Math.PI)*(.025+ribbon.index*.01);
          const k=i*6;ribbon.positions[k]=-offset;ribbon.positions[k+1]=centerY-width;ribbon.positions[k+2]=-.15+ribbon.index*.05;
          ribbon.positions[k+3]=-offset;ribbon.positions[k+4]=centerY+width;ribbon.positions[k+5]=-.15+ribbon.index*.05;
        }
        ribbon.mesh.geometry.attributes.position.needsUpdate=true;ribbon.mesh.material.opacity=.22*opacity;
      }
      ring.position.set(2.7,.05,1);ring.scale.setScalar(.3+impact*1.3);ring.material.opacity=impact>0?(1-impact)*.5:0;
      for(let i=0;i<sparks.length;i++){
        const spark=sparks[i];
        if(impact>0){const a=i*2.39996,r=impact*(.6+(i%6)*.22);spark.position.set(2.7+Math.cos(a)*r,.05+Math.sin(a)*r,1);spark.material.opacity=(1-impact)*.8;}
        else {const p=(i/26+time*.04)%1;const sx=.6-p*3.2;spark.position.set(sx,Math.sin(i*4.3+time)*.32,Math.cos(i*2.1)*.2);spark.material.opacity=(1-p)*.4*opacity;}
      }
      renderer.render(scene,camera);
    };
    frame=requestAnimationFrame(render);setReady(true);
    return()=>{
      cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();preference.removeEventListener('change',preferenceChanged);
      el.removeEventListener('pointermove',pointer);el.removeEventListener('pointerleave',leave);
      const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
      scene.traverse(obj=>{if(obj instanceof THREE.Mesh){geometries.add(obj.geometry);const m=obj.material;Array.isArray(m)?m.forEach(v=>materials.add(v)):materials.add(m);}else if(obj instanceof THREE.Sprite)materials.add(obj.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());texture.dispose();renderer.dispose();renderer.domElement.remove();
      if(resetTimer.current)clearTimeout(resetTimer.current);
    };
  },[]);

  const cast=()=>{
    if(busy.current||!ready)return;
    castAt.current=performance.now();busy.current=true;setCasting(true);
    resetTimer.current=setTimeout(()=>{busy.current=false;setCasting(false);},reduced?450:1650);
  };
  return <section className="charm-section section" aria-labelledby="charm-title">
    <div className="charm-copy"><p className="overline">OFF THE CLOCK / AN INTERACTION STUDY</p><h2 id="charm-title">Ahri’s Charm.</h2><p>A nod to my favorite champion. A heart-shaped projectile, pink ribbons, and a little input-driven animation.</p><div className="charm-actions"><button className="button charm-cast" onClick={cast} disabled={!ready||casting}><kbd>E</kbd>{casting?'Casting…':'Cast Charm'}<span>↗</span></button><button className="charm-motion" aria-pressed={paused} onClick={()=>{motion.current=paused;setPaused(!paused);}}>{paused?'Resume idle motion':'Pause idle motion'}</button></div><small>Click Cast Charm, or focus the scene and press E.</small></div>
    <div className="charm-stage" tabIndex={0} role="group" aria-label="Interactive Ahri Charm effect. Press E or Enter to cast." onKeyDown={e=>{if(!e.repeat&&(e.key.toLowerCase()==='e'||e.key==='Enter')){e.preventDefault();cast();}}}>
      <div className="charm-stage-label"><span>AHRI / E</span><span>CHARM</span></div><div ref={host} className="charm-canvas" aria-hidden="true">{fallback&&<div className={casting?'charm-fallback casting':'charm-fallback'}><span>♥</span><i>♥</i><b>♥</b></div>}</div><div className="charm-stage-bottom"><span>MOVE TO CHANGE PERSPECTIVE</span><span>THREE.JS</span></div>
    </div>
  </section>;
}
