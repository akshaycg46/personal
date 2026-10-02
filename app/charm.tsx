'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

function makeHeart() {
  const path = new THREE.Shape();
  path.moveTo(0, -.92);
  path.bezierCurveTo(-.23,-.64,-.94,-.04,-.94,.43);
  path.bezierCurveTo(-.94,1.02,-.29,1.14,0,.62);
  path.bezierCurveTo(.29,1.14,.94,1.02,.94,.43);
  path.bezierCurveTo(.94,-.04,.23,-.64,0,-.92);
  const geometry=new THREE.ExtrudeGeometry(path,{depth:.22,bevelEnabled:true,bevelSize:.07,bevelThickness:.09,bevelSegments:6,curveSegments:36,steps:1});
  geometry.center();return {geometry,path};
}
function glowMap(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d')!;const g=ctx.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.1,'rgba(255,225,246,.85)');g.addColorStop(.3,'rgba(255,144,221,.3)');g.addColorStop(1,'rgba(255,94,205,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(canvas);
}

export default function Charm(){
  const host=useRef<HTMLDivElement>(null);
  const commands=useRef<{cast:()=>void;toggle:()=>void}|null>(null);
  const [ready,setReady]=useState(false),[casting,setCasting]=useState(false),[paused,setPaused]=useState(false),[fallback,setFallback]=useState(false);
  useEffect(()=>{
    const el=host.current,hero=el?.closest('.hero') as HTMLElement|null;if(!el||!hero)return;
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');let reduced=preference.matches,enabled=!reduced;
    setPaused(!enabled);
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});}catch{
      setFallback(true);setReady(true);let timer:ReturnType<typeof setTimeout>|null=null;
      commands.current={cast:()=>{if(timer)return;setCasting(true);hero.classList.add('charm-active');timer=setTimeout(()=>{setCasting(false);hero.classList.remove('charm-active');timer=null;},1200);},toggle:()=>setPaused(v=>!v)};
      return()=>{if(timer)clearTimeout(timer);commands.current=null;hero.classList.remove('charm-active');};
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setClearColor('#000000');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
    el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,1000);camera.position.z=500;
    const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
    const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.9,.6,.55);composer.addPass(bloom);composer.addPass(new OutputPass());
    const {geometry,path}=makeHeart();
    const heartMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uTime:{value:0},uAlpha:{value:1},uEnergy:{value:1}},
      vertexShader:`varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`varying vec3 vN;varying vec3 vV;varying vec3 vP;uniform float uTime;uniform float uAlpha;uniform float uEnergy;
        void main(){float rim=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.8);float center=exp(-dot(vP.xy,vP.xy)*2.9);
        float flow=sin(vP.x*10.+vP.y*7.-uTime*3.)*.5+.5;float vein=pow(flow,12.)*.13;
        vec3 pink=vec3(1.12,.09,.55);vec3 pearl=vec3(2.4,1.4,2.);vec3 violet=vec3(.75,.25,1.2);
        vec3 color=mix(pink,pearl,center*.75)+rim*violet*1.8+vein*vec3(1.,.4,.7);
        gl_FragColor=vec4(color*uEnergy,uAlpha);}`});
    const projectile=new THREE.Group();scene.add(projectile);
    const heart=new THREE.Mesh(geometry,heartMaterial);projectile.add(heart);
    const texture=glowMap();
    const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:'#e94da9',transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));halo.scale.set(5.2,5.2,1);halo.position.z=-.25;heart.add(halo);
    const points=path.getPoints(100).map(p=>new THREE.Vector3(p.x,p.y,.23));
    const gold=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#ffc5b1',transparent:true,opacity:.5,blending:THREE.AdditiveBlending}));gold.scale.setScalar(1.045);heart.add(gold);
    const filigree=new THREE.Group();projectile.add(filigree);
    for(let i=0;i<2;i++){
      const curve=new THREE.EllipseCurve(0,0,1.24,1.24,0,Math.PI*2,false,0);
      const line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(curve.getPoints(96)),new THREE.LineBasicMaterial({color:i?'#d788ff':'#ffd4ad',transparent:true,opacity:.22,blending:THREE.AdditiveBlending}));
      line.rotation.set(i?.85:.35,i?.3:.95,i*.5);filigree.add(line);
    }
    const trailGroup=new THREE.Group();scene.add(trailGroup);
    const ribbonRows=72;
    const ribbons=Array.from({length:4},(_,i)=>{
      const positions=new Float32Array(ribbonRows*6);const indices:number[]=[];
      for(let j=0;j<ribbonRows-1;j++){const k=j*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geo.setIndex(indices);
      const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:['#ff4da8','#c271ff','#ffc7e7','#f5ba93'][i],transparent:true,opacity:0,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false}));mesh.frustumCulled=false;trailGroup.add(mesh);return{mesh,positions,index:i};
    });
    const ghosts=Array.from({length:9},(_,i)=>{
      const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:i%2?'#e981ff':'#ffb0d4',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(mesh);return mesh;
    });
    const particles=Array.from({length:68},(_,i)=>{
      const material=new THREE.SpriteMaterial({map:texture,color:i%5===0?'#ffd9b0':i%2?'#d17dff':'#ffa0d4',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
      const sprite=new THREE.Sprite(material);scene.add(sprite);return sprite;
    });
    const shockwaves=Array.from({length:2},(_,i)=>{
      const mesh=new THREE.Mesh(new THREE.RingGeometry(.95,1,128),new THREE.MeshBasicMaterial({color:i?'#e286f0':'#ffd1e6',transparent:true,opacity:0,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false}));scene.add(mesh);return mesh;
    });
    let width=1,height=1,time=0,last=performance.now(),frame=0,start=-10000,inView=true,isCasting=false;
    const origin=new THREE.Vector2(),aim=new THREE.Vector2(),target=new THREE.Vector2(),position=new THREE.Vector2();
    let initialized=false;
    const resize=()=>{
      width=el.clientWidth;height=el.clientHeight;renderer.setSize(width,height);composer.setSize(width,height);
      camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();
      const mobile=width<700;origin.set(width*(mobile?.22:.22),height*(mobile?-.2:-.025));
      if(!initialized){aim.set(-width*.15,height*.02);initialized=true;}
    };
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    const visibility=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??true;},{threshold:.05});visibility.observe(hero);
    const cast=()=>{
      if(isCasting||!inView)return;
      target.copy(aim);start=performance.now();isCasting=true;setCasting(true);
      hero.classList.add('charm-active');
    };
    const toggle=()=>{enabled=!enabled;setPaused(!enabled);};commands.current={cast,toggle};
    const move=(e:PointerEvent)=>{const b=hero.getBoundingClientRect();aim.set(e.clientX-b.left-width/2,height/2-(e.clientY-b.top));};
    const tap=(e:PointerEvent)=>{if((e.target as HTMLElement).closest('button,a,nav'))return;if((e.target as HTMLElement).closest('.hero-image'))cast();};
    const key=(e:KeyboardEvent)=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const tag=(e.target as HTMLElement)?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag)||((e.target as HTMLElement)?.isContentEditable))return;if(e.key.toLowerCase()==='e'&&inView){e.preventDefault();cast();}};
    const pref=()=>{reduced=preference.matches;enabled=!reduced;setPaused(!enabled);};
    hero.addEventListener('pointermove',move);hero.addEventListener('pointerdown',tap);window.addEventListener('keydown',key);preference.addEventListener('change',pref);
    const pointOnPath=(t:number)=>new THREE.Vector2().lerpVectors(origin,target,t).add(new THREE.Vector2(0,Math.sin(t*Math.PI)*Math.min(90,height*.12)));
    const render=(now:number)=>{
      frame=requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.04);last=now;
      if(!inView||document.hidden)return;if(enabled)time+=dt;
      const age=(now-start)/1000;const active=isCasting&&age<1.65;
      const flight=Math.max(0,Math.min(1,(age-.2)/.78));const impact=Math.max(0,Math.min(1,(age-.98)/.67));
      const size=width<700?29:38;
      if(active&&!reduced){position.copy(pointOnPath(flight));}
      else position.copy(origin);
      const show=active?(age<.98?1:0):1;
      projectile.position.set(position.x,position.y+(active?0:Math.sin(time*1.4)*6),1);
      const windup=active&&age<.2?1+Math.sin(age/.2*Math.PI)*.2:1;
      projectile.scale.setScalar(size*windup*(active?1:.64));
      heart.rotation.set(.05,Math.sin(time*.7)*.18,active?Math.sin(flight*Math.PI)*-.16:Math.sin(time*.8)*.06);
      heartMaterial.uniforms.uTime.value=time;heartMaterial.uniforms.uAlpha.value=reduced?1:show;heartMaterial.uniforms.uEnergy.value=active?1.2: .9;
      filigree.rotation.z=time*.18;filigree.visible=!active||age<.98;
      for(const child of filigree.children)(child as THREE.LineLoop<THREE.BufferGeometry,THREE.LineBasicMaterial>).material.opacity=(active?.3:.1)*(reduced?1:show);
      halo.material.opacity=(active?.2:.08)*(reduced?1:show);
      for(const r of ribbons){
        const length=Math.min(flight,.43);
        for(let j=0;j<ribbonRows;j++){
          const p=j/(ribbonRows-1),t=Math.max(0,flight-length*(1-p));const q=pointOnPath(t);
          const tangent=pointOnPath(Math.min(1,t+.01)).sub(pointOnPath(Math.max(0,t-.01))).normalize();const normal=new THREE.Vector2(-tangent.y,tangent.x);
          const wave=Math.sin(p*9-time*10+r.index*1.7)*(1-p)*14;
          const spread=(r.index-1.5)*5*(1-p),halfWidth=Math.sin(p*Math.PI)*(r.index===0?8:3);
          const a=q.clone().addScaledVector(normal,wave+spread-halfWidth),b=q.clone().addScaledVector(normal,wave+spread+halfWidth);const k=j*6;
          r.positions[k]=a.x;r.positions[k+1]=a.y;r.positions[k+2]=.2;r.positions[k+3]=b.x;r.positions[k+4]=b.y;r.positions[k+5]=.2;
        }
        r.mesh.geometry.attributes.position.needsUpdate=true;r.mesh.material.opacity=active&&!reduced&&age<1.2?(age>.98?(1-impact)*.3:.25):0;
      }
      for(let i=0;i<ghosts.length;i++){
        const g=ghosts[i],t=flight-(i+1)*.04,q=pointOnPath(Math.max(0,t));g.position.set(q.x,q.y+Math.sin(time*4+i)*8,.3);
        g.scale.setScalar(size*(.24-i*.017));g.rotation.z=Math.sin(time*3+i)*.3;g.material.opacity=active&&!reduced&&t>0&&age<1.15?(.28-i*.024)*(1-impact):0;
      }
      for(let i=0;i<particles.length;i++){
        const p=particles[i],seed=i*2.39996;
        if(active&&impact>0&&!reduced){const radius=(30+(i%11)*7)*Math.pow(impact,.6);p.position.set(target.x+Math.cos(seed)*radius,target.y+Math.sin(seed)*radius,1);p.scale.setScalar(3+(i%5)*2);p.material.opacity=(1-impact)*.85;}
        else if(active&&!reduced){const t=Math.max(0,flight-(i%23)*.014),q=pointOnPath(t);p.position.set(q.x+Math.cos(seed+time)*16,q.y+Math.sin(seed+time)*20,.8);p.scale.setScalar(3+(i%3)*2);p.material.opacity=flight>0?(.5-(i%23)*.017):0;}
        else{p.position.set(origin.x+Math.sin(seed+time*.3)*(35+i%7*5),origin.y+Math.cos(seed+time*.35)*(30+i%6*4),.5);p.scale.setScalar(i%5===0?3:1.7);p.material.opacity=enabled&&!reduced?.12:0;}
      }
      for(let i=0;i<shockwaves.length;i++){
        const ring=shockwaves[i];ring.position.set(target.x,target.y,1);ring.scale.setScalar((20+impact*(i?85:120))*(i?.85:1));ring.material.opacity=active&&impact>0&&!reduced?(1-impact)*.4:0;
      }
      if(isCasting&&age>=1.65){isCasting=false;setCasting(false);hero.classList.remove('charm-active');}
      composer.render();
    };
    frame=requestAnimationFrame(render);setReady(true);
    const entrance=window.setTimeout(()=>{if(!reduced&&inView)cast();},1100);
    return()=>{
      window.clearTimeout(entrance);cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();commands.current=null;
      hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerdown',tap);window.removeEventListener('keydown',key);preference.removeEventListener('change',pref);hero.classList.remove('charm-active');
      const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){geometries.add(o.geometry);Array.isArray(o.material)?o.material.forEach(m=>materials.add(m)):materials.add(o.material);}else if(o instanceof THREE.Sprite)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());texture.dispose();bloom.dispose();composer.dispose();renderer.dispose();renderer.domElement.remove();
    };
  },[]);
  return <>
    <div className="hero-charm-layer" data-casting={casting} ref={host} aria-hidden="true">{fallback&&<div className="hero-charm-fallback">♥</div>}</div>
    <div className="hero-charm-controls"><div><span className="charm-skin-label">SPIRIT BLOSSOM</span><button className="hero-cast" disabled={!ready||casting} onClick={()=>commands.current?.cast()}><kbd>E</kbd><span>{casting?'Casting Charm':'Cast Charm'}</span><b>↗</b></button></div><button className="hero-motion" onClick={()=>commands.current?.toggle()} aria-pressed={paused}>{paused?'Enable ambient motion':'Pause ambient motion'}</button><small>Move to aim · Press E or tap the artwork</small></div>
  </>;
}
