'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
export default function Spirit({color,motion}:{color:string;motion:boolean}) {
 const host=useRef<HTMLDivElement>(null); const [failed,setFailed]=useState(false);
 useEffect(()=>{
 const el=host.current;if(!el)return;
 let renderer:THREE.WebGLRenderer;
 try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});} catch {setFailed(true);return;}
 const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.z=7;
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));el.appendChild(renderer.domElement);
 const group=new THREE.Group();scene.add(group);
 const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(1,5),new THREE.MeshPhysicalMaterial({color,metalness:.35,roughness:.2,transparent:true,opacity:.85,wireframe:false,emissive:color,emissiveIntensity:.22}));group.add(orb);
 const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.035,2),new THREE.MeshBasicMaterial({color,wireframe:true,transparent:true,opacity:.2}));group.add(wire);
 for(let i=0;i<9;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.5+i*.055,.007,6,128),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.3+i*.05}));ring.rotation.set(i*.39,i*.23,i*.55);group.add(ring);}
 const points=new Float32Array(360);for(let i=0;i<120;i++){const a=i*2.39996,r=2.1+(i%7)*.12;points[i*3]=Math.cos(a)*r;points[i*3+1]=Math.sin(a)*r;points[i*3+2]=Math.sin(i*4.2)*1.5;}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(points,3));group.add(new THREE.Points(geo,new THREE.PointsMaterial({color,size:.025,transparent:true,opacity:.7})));
 scene.add(new THREE.AmbientLight('#ffffff',2));const light=new THREE.PointLight('#c8efff',35);light.position.set(2,3,4);scene.add(light);
 let targetX=0,targetY=0,frame=0;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');let visible=true;
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(el);resize();
 const move=(e:PointerEvent)=>{const box=el.getBoundingClientRect();targetY=((e.clientX-box.left)/box.width-.5)*.9;targetX=((e.clientY-box.top)/box.height-.5)*.6;};el.addEventListener('pointermove',move);
 const visibility=()=>{visible=!document.hidden;};document.addEventListener('visibilitychange',visibility);
 const render=(t:number)=>{frame=requestAnimationFrame(render);if(!visible)return;if(motion&&!reduce.matches){group.rotation.y+=(targetY-group.rotation.y)*.025;group.rotation.x+=(targetX-group.rotation.x)*.025;orb.rotation.y=t*.00015;wire.rotation.y=-t*.0001;group.position.y=Math.sin(t*.0007)*.07;}renderer.render(scene,camera);};frame=requestAnimationFrame(render);
 return()=>{cancelAnimationFrame(frame);observer.disconnect();el.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points){o.geometry.dispose();const m=o.material;Array.isArray(m)?m.forEach(x=>x.dispose()):m.dispose();}});renderer.dispose();renderer.domElement.remove();};
 },[color,motion]);
 return <div ref={host} className="spirit-canvas" role="img" aria-label="Interactive three-dimensional spirit orb surrounded by nine orbiting rings">{failed&&<div className="orb-fallback" aria-label="Glowing spirit orb"/>}</div>;
}
