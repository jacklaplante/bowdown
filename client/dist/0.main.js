(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,function(e,t,n){"use strict";n.r(t);var o=n(2),i=new(n(3).a),a=n(4),c=n.n(a),r=n(5),s=n.n(r),d=n(6),l=n.n(d),u=n(7),p=n.n(u),w=n(8),m=n.n(w),g=n(9),y=n.n(g),f=n(10),b=n.n(f),h=new o.eb,v=[];i.load(c.a,function(e){var t=e.scene;t.position.y-=10,h.add(t),v.push(t)});let x=[];x.push(new o.L({map:(new o.kb).load(s.a)})),x.push(new o.L({map:(new o.kb).load(l.a)})),x.push(new o.L({map:(new o.kb).load(p.a)})),x.push(new o.L({map:(new o.kb).load(m.a)})),x.push(new o.L({map:(new o.kb).load(y.a)})),x.push(new o.L({map:(new o.kb).load(b.a)}));for(let e=0;e<6;e++)x[e].side=o.c;let k=new o.e(1e3,1e3,1e3),L=new o.K(k,x);var z;h.add(L),h.add(((z=new o.r(16777215,10209703)).color.setHSL(.6,1,.8),z.groundColor.setHSL(.095,1,.75),z.position.set(0,50,0),z.visible=!0,z)),h.add(function(){var e=new o.l;e.color.setHSL(.1,1,.95),e.position.set(-1,1.75,1),e.position.multiplyScalar(30),e.castShadow=!0,e.shadow.mapSize.width=2048,e.shadow.mapSize.height=2048;return e.shadow.camera.left=-50,e.shadow.camera.right=50,e.shadow.camera.top=50,e.shadow.camera.bottom=-50,e.shadow.camera.far=3500,e.shadow.bias=-1e-4,e.visible=!0,e}());var S=new o.sb({antialias:!0,alpha:!0});S.setClearColor("#e5e5e5"),screen.width<screen.height?S.setSize(window.innerHeight,window.innerWidth,!1):S.setSize(window.innerWidth,window.innerHeight,!1),S.setPixelRatio(window.devicePixelRatio),S.gammaOutput=!0,S.gammaFactor=2.2;const M=!1;function A(e,t){if(M){var n=new o.p;n.vertices.push(t,new o.pb);var i=new o.y({color:16711680}),a=new o.x(n,i);a.name="collision line",e.gltf.scene.add(a)}}function B(e,t){var n;return e.gltf.animations.forEach(e=>{e.name!==t||(n=e)}),null==n&&console.error("animation: "+t+" cannot be found!"),n}function F(e,t){t.mixer=e,t.anim={idle:e.clipAction(B(t,"Idle")),running:e.clipAction(B(t,"Running best")),runWithBow:e.clipAction(B(t,"Running with bow best")),runWithLegsOnly:e.clipAction(B(t,"Running legs only")),jumping:e.clipAction(B(t,"Jumping")).setLoop(o.G),equipBow:e.clipAction(B(t,"Equip Bow")).setLoop(o.G),drawBow:e.clipAction(B(t,"Draw bow")).setLoop(o.G),fireBow:e.clipAction(B(t,"Fire bow")).setLoop(o.G)},t.anim.drawBow.clampWhenFinished=!0,t.toggleBow=function(e){t.gltf.scene.children[0].children[1].visible=!e,t.gltf.scene.children[0].children[2].visible=e},t.bowAction=function(e){t.anim&&t.anim[e]?t.activeBowAction!=e&&(t.activeBowAction&&t.anim[t.activeBowAction].stop(),t.activeMovement&&"runWithLegsOnly"!=t.activeMovement&&t.anim[t.activeMovement].stop(),e&&t.anim[e].reset().play(),t.activeBowAction=e):console.error("action: "+e+" does not exist!")},t.movementAction=function(e="idle"){if(t.anim&&t.anim[e]){if(t.activeMovement){if(t.activeMovement==e)return;t.anim[t.activeMovement].stop()}t.anim[e].reset().play(),t.activeMovement=e}else console.error("action: "+e+" does not exist!")},t.isRunning=function(){return!!t.activeMovement&&t.activeMovement.toLowerCase().includes("run")},t.isFiring=function(){return t.bowState&&("drawn"==t.bowState||"drawing"==t.bowState||"firing"==t.bowState)},t.getPosition=function(){if(t.gltf)return t.gltf.scene.position;console.error("archer.gltf has not been defined yet")},t.getRotation=function(){if(t.gltf)return t.gltf.scene.rotation;console.error("archer.gltf has not been defined yet")}}const P=new WebSocket("ws://ec2-18-191-136-250.us-east-2.compute.amazonaws.com:18181");function E(e){P.readyState&&P.send(JSON.stringify(e))}P.onmessage=function(e){var t,n;if((e=JSON.parse(e.data)).players&&O.init(e.players),e.player){var i=e.player;i==T?e.damage&&U.takeDamage(e.damage):e.chatMessage?function(e){var t=document.createTextNode(e),n=document.createElement("p").appendChild(t);document.getElementById("chat").appendChild(n)}(e.chatMessage):"disconnected"===e.status?(h.remove(O.get(i).scene),O.get(i)):O.get(i)?O.get(i).gltf&&e.position&&null!=e.rotation&&O.move(i,e.position,e.rotation,e.movementAction,e.bowAction):O.add(i,e.position,e.race)}else e.arrow&&(t=e.arrow,(n=H(t.origin,t.rotation)).velocity=new o.pb(t.velocity.x,t.velocity.y,t.velocity.z),C.push(n),I(n,(Date.now()-t.timeOfShoot)/1e3))};var O={},W={},q=[];O.all=function(){return W},O.get=e=>W[e],O.add=function(e,t,n){W[e]={},null==n&&(console.error("race is undefined"),n="brown"),i.load("./models/benji_"+n+".gltf",function(n){W[e].gltf=n,F(new o.b(n.scene),W[e]),t&&O.move(e,t,0),h.add(n.scene);var i=new o.K(new o.e(.5,2,.5));i.position.y+=1,i.material.visible=!1,n.scene.add(i),i.playerUuid=e,q.push(i)})},O.init=function(e){Object.keys(e).forEach(t=>{O.add(t,new o.pb(e[t].x,e[t].y,e[t].z),e[t].race)})},O.move=function(e,t,n,o,i){var a=W[e];a.gltf.scene.position.copy(t),a.gltf.scene.rotation.y=n,o&&a.movementAction(o),i&&a.bowAction(i)};var j=[],C=[],R=.06,D=.75;function H(e,t){var n=new o.e(R,R,D),i=new o.L({color:65280}),a=new o.K(n,i);return a.origin=e,a.position.copy(e),a.rotation.copy(t),h.add(a),a}function I(e,t){e.velocity.y-=9*t,e.position.add(e.velocity.clone().multiplyScalar(t))}function Y(e){j.forEach(t=>{if(!t.stopped){!function(e){(e.position.x>500||e.position.x<-500||e.position.y>500||e.position.y<-500||e.position.z>500||e.position.z<-500)&&(e.stopped=!0)}(t),I(t,e);var n=new o.pb(0,0,1);n.applyEuler(t.rotation).normalize();var i=t.position.clone().sub(t.origin).length()/2,a=new o.cb(t.position,n,0,i),c=a.intersectObjects(q);if(c.length>0){var r=c.pop();t.position.copy(r.point),t.stopped=!0,function(e){E({player:e,damage:100})}(r.object.playerUuid)}(c=a.intersectObjects(v,!0)).length>0&&(t.position.copy(c.pop().point),t.stopped=!0)}}),C.forEach(t=>{I(t,e)})}var X,T="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}),U={};const G=.12;U.race=["black","brown","white"][Math.floor(3*Math.random())],i.load("./models/benji_"+U.race+".gltf",e=>{U.gltf=e,U.velocity=new o.pb,U.bowState="unequipped",h.add(e.scene),F(X=new o.b(e.scene),U),X.addEventListener("finished",e=>{"Draw bow"==e.action.getClip().name?U.bowState="drawn":("Fire bow"==e.action.getClip().name&&(U.bowState="equipped"),U.idle())}),E({player:T,position:U.getPosition(),race:U.race}),U.falling=function(e){if(e){var t=U.getPosition().clone().add(U.velocity.clone().multiplyScalar(e));t.y-=.1;var n=new o.pb(0,1,0),i=new o.cb(t,n,0,.2+Math.abs(U.velocity.y*e)).intersectObjects(v,!0);return!(i.length>0)||(U.getPosition().copy(i[i.length-1].point),!1)}},U.collisionDetected=function(e){var t;t=U,M&&t.gltf.scene.children.forEach(e=>{"collision line"===e.name&&t.gltf.scene.remove(e)});for(var n=-1;n<=1;n++)for(var i=-1;i<=1;i++){n*=.5,i*=.5;var a=new o.pb(n,1,i);a=a.clone().normalize();var c=new o.cb(new o.pb(e.x,e.y,e.z),a,0,a.length());if(A(U,a),c.intersectObjects(v,!0).length>0)return a}return!1},U.playBowAction=function(e){U.isRunning()&&"runWithLegsOnly"!=U.activeMovement?U.movementAction("runWithLegsOnly"):U.activeMovement&&(U.anim[U.activeMovement].stop(),U.activeMovement=null),U.bowAction(e),U.broadcast()},U.onMouseDown=function(){"unequipped"==U.bowState?U.equipBow():(U.playBowAction("drawBow"),U.bowState="drawing",N.zoomIn())},U.onMouseUp=function(){"drawn"==U.bowState?(U.playBowAction("fireBow"),U.anim.drawBow.stop(),function(){var e=U.getPosition().clone().add(new o.pb(0,1.5,0)),t=H(e,N.rotation),n=new o.cb;n.setFromCamera({x:0,y:0},N);var i,a=n.intersectObjects(v.concat(q),!0);a.length>0?i=a[0].point.sub(e):(i=new o.pb,N.getWorldDirection(i)),t.velocity=i.normalize().multiplyScalar(60),j.push(t),E({arrow:{origin:t.position,rotation:t.rotation,velocity:t.velocity,timeOfShoot:Date.now()}})}(),U.bowState="firing",N.zoomOut()):"drawing"===U.bowState&&(U.anim.drawBow.stop(),U.anim[U.activeBowAction].stop(),U.activeBowAction=null,U.bowState="equipped",U.idle(),N.zoomOut())},U.broadcast=async function(){E({player:T,position:U.getPosition(),rotation:U.getRotation().y,movementAction:U.activeMovement,bowAction:U.activeBowAction,bowState:U.bowState})},U.animate=function(e,t){var n,i=U.falling(e);if(!i){var a=function(e){var t=new o.pb;N.getWorldDirection(t),(t=new o.ob(t.x,t.z)).normalize().multiplyScalar(G);var n=0,i=0;if(0!=e.touch.x&&0!=e.touch.y){var a=new o.ob(e.touch.x,e.touch.y).normalize();n=a.x,i=a.y}return e.keyboard.forward&&(n+=0,i+=1),e.keyboard.backward&&(n+=0,i+=-1),e.keyboard.left&&(n+=-1,i+=0),e.keyboard.right&&(n+=1,i+=0),t.rotateAround(new o.ob,Math.atan2(n,i))}(t),c=Math.atan2(a.x,a.y);if(t.keyboard.space?(U.velocity.y=5,U.movementAction("jumping")):U.velocity.set(0,0,0),0!=t.touch.x&&0!=t.touch.y||t.keyboard.forward||t.keyboard.backward||t.keyboard.left||t.keyboard.right)if(t.keyboard.space)U.velocity.x=a.x/e,U.velocity.z=a.y/e;else{(n=U.getPosition().clone()).z+=a.y,n.x+=a.x;var r=new o.pb(n.x,n.y+1,n.z),s=new o.cb(r,new o.pb(0,-1,0),0,1).intersectObjects(v,!0);s.length>0&&(n.y=s[0].point.y+.01),U.isRunning()||("equipped"==U.bowState?U.movementAction("runWithBow"):U.isFiring()?U.movementAction("runWithLegsOnly"):U.movementAction("running"))}else if(U.isRunning()&&(U.isFiring()?U.anim[U.activeMovement].stop():U.idle()),U.isFiring()){a=new o.pb;N.getWorldDirection(a),c=Math.atan2(a.x,a.z),U.getRotation().y=c,N.updateCamera(),U.broadcast()}}if(i||n||U.velocity.x||U.velocity.y||U.velocity.z){n||(n=U.getPosition().clone()),n.add(U.velocity.clone().multiplyScalar(e));var d=U.collisionDetected(n);if(d)i?(U.velocity.copy(d.clone().negate().normalize().multiplyScalar(10)),n.add(U.velocity.clone().multiplyScalar(e)),U.getPosition().copy(n)):U.velocity.set(0,0,0);else{if(i&&(U.velocity.y-=10*e),U.getPosition().copy(n),U.isFiring()){a=new o.pb;N.getWorldDirection(a),c=Math.atan2(a.x,a.z)}else null==c&&(c=U.getRotation().y);U.getRotation().y=c,N.updateCamera()}U.broadcast()}},U.idle=function(){U.movementAction("idle"),U.broadcast()},U.equipBow=function(){U.bowState="equipped",U.playBowAction("equipBow"),U.toggleBow(!0)},U.unequipBow=function(){U.toggleBow(!1),U.bowState="unequipped"},U.takeDamage=function(){ye(),U.getPosition().y-=20},U.respawn=function(){U.getPosition().copy(new o.pb)},U.sendChat=function(e){E({player:T,chatMessage:e})},U.equipBow(),U.idle()});var J,K;window.innerWidth<window.innerHeight?(J=window.innerHeight,K=window.innerWidth):(J=window.innerWidth,K=window.innerHeight);var N=new o.U(75,J/K,.1,3e3);N.zoomState="out";const _=N.getFocalLength(),Q=N.getFocalLength()+16;N.position.z=5;var V=new o.pb(0,1.5,0),Z=0,$=0;N.nextPosition=function(e){if(null!=U){var t=new o.pb;return t.x=V.x+e*Math.sin(Z*Math.PI/360)*Math.cos($*Math.PI/360),t.y=V.y+e*Math.sin($*Math.PI/360),t.z=V.z+e*Math.cos(Z*Math.PI/360)*Math.cos($*Math.PI/360),t}},N.zoomIn=function(){N.zoomState="zooming in"},N.zoomOut=function(){N.zoomState="zooming out"},N.animate=function(e){if("zooming in"==N.zoomState)N.getFocalLength()<Q&&((t=N.getFocalLength()+60*e)<Q?N.setFocalLength(t):(N.setFocalLength(Q),N.zoomState="in"));else if("zooming out"==N.zoomState){var t;if(N.getFocalLength()>_)(t=N.getFocalLength()-60*e)>_?N.setFocalLength(t):(N.setFocalLength(_),N.zoomState="out")}},N.setPosition=function(e){N.position.copy(e)},N.updateCamera=function(){if(null!=U){var e=U.getPosition().clone().sub(N.position.clone()),t=new o.pb(-e.z,0,e.x).normalize();V.copy(U.getPosition().clone().add(t)).setY(U.getPosition().y+1.5);var n=N.nextPosition(3.5),i=new o.cb(V,n.clone().sub(V).normalize(),0,3.5).intersectObjects(v,!0);i.length>0&&(n=i[0].point.clone().sub(n.clone().sub(i[0].point).normalize().multiplyScalar(.1))),N.setPosition(n)}N.lookAt(V),N.updateMatrix()},N.moveCamera=function(e,t){Z-=.2*e;var n=$+.2*t;135>=n&&n>=-80&&($=n),N.updateCamera()},n.d(t,"start",function(){return Le}),n.d(t,"gameOver",function(){return ye});var ee=new o.i;window.addEventListener("resize",function(){var e,t;e=window.innerWidth,t=window.innerHeight,se&&window.innerWidth>window.innerHeight?(se=!1,document.body.classList.remove("rotated")):se?(e=window.innerHeight,t=window.innerWidth):window.innerWidth<window.innerHeight&&(ke(),e=window.innerHeight,t=window.innerWidth);S.setSize(e,t,!1),N.aspect=e/t,N.updateProjectionMatrix()});var te={keyboard:{forward:!1,backward:!1,left:!1,right:!1,space:!1},touch:{x:0,y:0}},ne="playing",oe=!1,ie={id:null,x:null,y:null,shoot:!1},ae={id:null,x:null,y:null};const ce=4,re=document.getElementById("shoot-button");var se;function de(){requestAnimationFrame(de);var e=ee.getDelta();Y(e),U&&X&&(U.animate(e,te),X.update(e)),Object.keys(O.all()).length&&function(e){Object.keys(W).forEach(t=>{W[t].mixer&&W[t].mixer.update(e)})}(e),N.animate(e),S.render(h,N)}function le(e,t){switch(e.key){case"w":te.keyboard.forward=t;break;case"a":te.keyboard.left=t;break;case"s":te.keyboard.backward=t;break;case"d":te.keyboard.right=t;break;case" ":te.keyboard.space=t}}function ue(e){13===e.keyCode&&document.getElementById("chat").classList.contains("chatting")&&U.sendChat(document.getElementById("chat-text-box").value),le(e,!0)}function pe(e){le(e,!1)}function we(){"chat"==event.target.id?event.target.classList.add("chatting"):2!=event.button&&("paused"==ne?(document.body.requestPointerLock&&document.body.requestPointerLock(),ge()):"playing"==ne&&U.onMouseDown())}function me(){"playing"===ne&&U.onMouseUp()}function ge(){document.body.classList.remove("ready"),document.body.classList.add("playing"),ne="playing"}function ye(){ne="gameOver",document.body.classList.remove("playing"),document.getElementById("title").innerHTML="Game over",document.body.classList.remove("playing"),document.body.classList.add("gameOver")}function fe(){ne=document.pointerLockElement?"playing":"paused"}function be(e){e!=oe&&(e?re.setAttribute("style","display: block;"):re.setAttribute("style","display: none;"),oe=e)}function he(e){var t,n,o;e.preventDefault(),be(!0);for(var i=0;i<e.targetTouches.length;i++)e.targetTouches.item(i).identifier==ie.id?t=e.targetTouches.item(i):e.targetTouches.item(i).identifier==ae.id?n=e.targetTouches.item(i):null==o&&(o=e.targetTouches.item(i));t?(se?N.moveCamera(ce*(t.pageY-ie.y),-1*ce*(t.pageX-ie.x)):N.moveCamera(ce*(t.pageX-ie.x),ce*(t.pageY-ie.y)),ie.x=t.pageX,ie.y=t.pageY):o&&("shoot-button"===o.target.id&&(U.onMouseDown(),ie.shoot=!0),(se&&o.pageY>window.innerHeight/2||!se&&o.pageX>window.innerWidth/2)&&(ie.id=o.identifier,ie.x=o.pageX,ie.y=o.pageY)),n?se?(te.touch.y=n.pageX-ae.x,te.touch.x=n.pageY-ae.y):(te.touch.x=n.pageX-ae.x,te.touch.y=-1*(n.pageY-ae.y)):o&&(se&&o.pageY<window.innerHeight/2||!se&&o.pageX<window.innerWidth/2)&&(ae.id=o.identifier,ae.x=o.pageX,ae.y=o.pageY)}function ve(e){ie.id==e.changedTouches[0].identifier?(ie.shoot&&U.onMouseUp(),ie.id=null,ie.shoot=!1):ae.id==e.changedTouches[0].identifier&&(ae.id=null,te.touch={x:0,y:0})}function xe(e){"shoot-button"!=e.target.id&&be(!1);var t=e.movementX||e.mozMovementX||e.webkitMovementX||0,n=e.movementY||e.mozMovementY||e.webkitMovementY||0;N.moveCamera(t,n)}function ke(){document.body.classList.add("rotated"),se=!0}function Le(){document.addEventListener("mousemove",xe),document.addEventListener("keydown",ue),document.addEventListener("keyup",pe),document.addEventListener("mousedown",we),document.addEventListener("mouseup",me),document.addEventListener("pointerlockchange",fe),document.addEventListener("touchstart",he),document.addEventListener("touchmove",he),document.addEventListener("touchend",ve),document.body.appendChild(S.domElement),window.innerWidth<window.innerHeight&&screen.orientation.type.includes("portrait")&&(document.body.requestFullscreen?document.body.requestFullscreen():document.body.mozRequestFullScreen?document.body.mozRequestFullScreen():document.body.webkitRequestFullscreen?document.body.webkitRequestFullscreen():document.body.msRequestFullscreen&&document.body.msRequestFullscreen(),ke()),de(),ge()}document.getElementById("respawn").onclick=function(){U.respawn(),ge()}},,,function(e,t,n){e.exports=n.p+"2fac3c8689875da451b1460bf44c6563.glb"},function(e,t,n){e.exports=n.p+"7892e5f13382f146373e2feee6999074.jpg"},function(e,t,n){e.exports=n.p+"bfbf6e3b2e9c92cee83c5cb73c602dff.jpg"},function(e,t,n){e.exports=n.p+"f900c2f67538e778beaa220d765ddb86.jpg"},function(e,t,n){e.exports=n.p+"dd72bb23dae86654c0018bf2164773ea.jpg"},function(e,t,n){e.exports=n.p+"40cb740f2b07e44047f4ca7823a46d21.jpg"},function(e,t,n){e.exports=n.p+"cf70fe3d246583aa691b7ff3fde1d03b.jpg"}]]);