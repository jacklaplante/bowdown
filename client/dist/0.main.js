(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,function(e,n,t){"use strict";t.r(n);var o,i=t(2),a=new(t(4).a),c=t(5),r=t.n(c),s=new i.eb,d=[];a.load(r.a,function(e){var n=e.scene;n.position.y-=10,s.add(n),d.push(n)}),s.add(((o=new i.q(16777215,16777215,.6)).color.setHSL(.6,1,.6),o.groundColor.setHSL(.095,1,.75),o.position.set(0,50,0),o.visible=!0,o)),s.add(function(){var e=new i.k(16777215,1);e.color.setHSL(.1,1,.95),e.position.set(-1,1.75,1),e.position.multiplyScalar(30),e.castShadow=!0,e.shadow.mapSize.width=2048,e.shadow.mapSize.height=2048;return e.shadow.camera.left=-50,e.shadow.camera.right=50,e.shadow.camera.top=50,e.shadow.camera.bottom=-50,e.shadow.camera.far=3500,e.shadow.bias=-1e-4,e.visible=!0,e}());var p=new i.sb({antialias:!0,alpha:!0});function u(e,n){var t;return e.forEach(e=>{e.name!==n||(t=e)}),t}function l(e,n){n.mixer=e,n.actions={idle:e.clipAction(u(n.animations,"Idle")),running:e.clipAction(u(n.animations,"Running2")),runWithBow:e.clipAction(u(n.animations,"Run with bow")),runWithLegsOnly:e.clipAction(u(n.animations,"Running legs only")),jumping:e.clipAction(u(n.animations,"Jumping")).setLoop(i.G),equipBow:e.clipAction(u(n.animations,"Equip Bow")).setLoop(i.G),drawBow:e.clipAction(u(n.animations,"Draw bow")).setLoop(i.G),fireBow:e.clipAction(u(n.animations,"Fire bow")).setLoop(i.G)},n.actions.drawBow.clampWhenFinished=!0}p.setClearColor("#e5e5e5"),p.setPixelRatio(window.devicePixelRatio),p.setSize(window.innerWidth,window.innerHeight),p.gammaOutput=!0,p.gammaFactor=2.2;var w=t(3),y=t.n(w);const m=new WebSocket("ws://ec2-18-191-136-250.us-east-2.compute.amazonaws.com:18181");function b(e){m.send(JSON.stringify(e))}m.onopen=function(){b({message:"sup fucker"})},m.onmessage=function(e){var n,t;if((e=JSON.parse(e.data)).players&&v.init(e.players),e.player){var o=e.player;o==q?e.damage&&E.takeDamage(e.damage):v.get(o)?"disconnected"===e.status?(s.remove(v.get(o).scene),v.get(o)):v.get(o).scene&&e.x&&e.y&&e.z&&e.rotation&&e.action?(v.move(o,new i.pb(e.x,e.y,e.z),e.rotation,e.action),v.get(o).state="moving"):e.action&&function(e,n){var t=h[e];t&&g(t,n)}(o,e.action):v.add(o,new i.pb(e.x,e.y,e.z))}else e.arrow&&(n=e.arrow,(t=S(n.origin,n.rotation)).velocity=new i.pb(n.velocity.x,n.velocity.y,n.velocity.z),k.push(t),M(t,(Date.now()-n.timeOfShoot)/1e3))};var v={},h={},f=[];function g(e,n){if(e.actions&&e.actions[n]){if(e.activeAction){if(e.activeAction==n)return;e.actions[e.activeAction].stop()}e.actions[n].reset().play(),e.activeAction=n}}v.all=function(){return h},v.get=e=>h[e],v.add=function(e,n){h[e]="loading",a.load(y.a,function(t){h[e]=t,l(new i.b(t.scene),t),n&&v.move(e,n,0),s.add(t.scene),g(t,"idle");var o=new i.K(new i.d(.5,2,.5));o.position.y+=1,o.material.visible=!1,t.scene.add(o),o.playerUuid=e,f.push(o)})},v.init=function(e){Object.keys(e).forEach(n=>{v.add(n,new i.pb(e[n].x,e[n].y,e[n].z))})},v.move=function(e,n,t,o){var i=h[e];i.scene.position.copy(n),i.scene.rotation.y=t,g(i,o)};var x=[],k=[],A=.06,z=.75;function S(e,n){var t=new i.d(A,A,z),o=new i.L({color:65280}),a=new i.K(t,o);return a.origin=e,a.position.copy(e),a.rotation.copy(n),s.add(a),a}function M(e,n){e.velocity.y-=9*n,e.position.add(e.velocity.clone().multiplyScalar(n))}function L(e){x.forEach(n=>{if(!n.stopped){M(n,e);var t=new i.pb(0,0,1);t.applyEuler(n.rotation).normalize();var o=n.position.clone().sub(n.origin).length()/2,a=new i.cb(n.position,t,0,o),c=a.intersectObjects(f);if(c.length>0){var r=c.pop();n.position.copy(r.point),n.stopped=!0,function(e){b({player:e,damage:100})}(r.object.playerUuid)}(c=a.intersectObjects(d,!0)).length>0&&(n.position.copy(c.pop().point),n.stopped=!0)}}),k.forEach(n=>{M(n,e)})}var E,B,q="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var n=16*Math.random()|0;return("x"==e?n:3&n|8).toString(16)});const j=.12;a.load(y.a,e=>{(E=e).velocity=new i.pb,E.bowState="unequipped",s.add(e.scene),l(B=new i.b(e.scene),E),B.addEventListener("finished",e=>{"Draw bow"!==e.action.getClip().name?E.playAction("idle"):E.bowState="drawn"}),E.falling=function(){var e=new i.pb(0,-1,0);e=e.clone().normalize();var n=new i.cb(new i.pb(E.scene.position.x,E.scene.position.y+.9,E.scene.position.z),e).intersectObjects(d,!0);return!(n.length>0&&n[0].distance<=new i.x(new i.pb,e).distance())};E.collisionDetected=function(e){for(var n=-1;n<=1;n++)for(var t=-1;t<=1;t++){n*=.5,t*=.5;var o=new i.pb(n,1,t);o=o.clone().normalize();var a=new i.cb(new i.pb(e.x,e.y,e.z),o).intersectObjects(d,!0);if(a.length>0&&a[0].distance<=new i.x(new i.pb,o).distance())return!0}return!1},E.playAction=function(e){E.activeAction&&(E.actions[E.activeAction].stop(),E.previousAction!=e&&E.activeAction!=e&&(E.previousAction=E.activeAction)),E.activeAction=e,E.actions[e].reset().play(),E.state=e,E.broadcast()},E.jump=function(){E.velocity.y=5,E.playAction("jumping")},E.onMouseDown=function(){"unequipped"==E.bowState?E.equipBow():(E.playAction("drawBow"),E.bowState="drawing")},E.onMouseUp=function(){"drawn"==E.bowState?(E.playAction("fireBow"),function(){var e=E.scene.position.clone().add(new i.pb(0,1.5,0)),n=S(e,O.rotation),t=new i.cb;t.setFromCamera({x:0,y:0},O);var o,a=t.intersectObjects(d.concat(f),!0);a.length>0?o=a[0].point.sub(e):(o=new i.pb,O.getWorldDirection(o)),n.velocity=o.normalize().multiplyScalar(60),x.push(n),b({arrow:{origin:n.position,rotation:n.rotation,velocity:n.velocity,timeOfShoot:Date.now()}})}(),E.bowState="equipped"):"drawing"===E.bowState&&(E.actions.drawBow.stop(),E.bowState="equipped",E.playAction("idle"))},E.broadcast=async function(){b({player:q,x:E.scene.position.x,y:E.scene.position.y,z:E.scene.position.z,rotation:E.scene.rotation.y,action:E.activeAction})},E.move=function(e,n=E.scene.rotation.y){E.collisionDetected(e)?E.velocity.set(0,0,0):(E.scene.position.copy(e),E.scene.rotation.y=n,O.updateCamera(),E.broadcast())},E.rotate=function(e){E.scene.rotation.y=e,E.broadcast()},E.isRunning=function(){return!!E.activeAction&&E.activeAction.toLowerCase().includes("run")},E.isAiming=function(){return"drawn"==E.bowState||"drawing"==E.bowState},E.animate=function(e,n){var t=new i.pb;if(E.falling())E.state="falling",E.velocity.y-=10*e,t=E.scene.position.clone().add(E.velocity.clone().multiplyScalar(e)),E.move(t);else{E.velocity.set(0,0,0);var o=function(e){var n=new i.pb;O.getWorldDirection(n),(n=new i.ob(n.x,n.z)).normalize().multiplyScalar(j);var t=0,o=0;if(0!=e.touch.x&&0!=e.touch.y){var a=new i.ob(e.touch.x,e.touch.y).normalize();t=a.x,o=a.y}return e.keyboard.forward&&(t+=0,o+=1),e.keyboard.backward&&(t+=0,o+=-1),e.keyboard.left&&(t+=-1,o+=0),e.keyboard.right&&(t+=1,o+=0),n.rotateAround(new i.ob,Math.atan2(t,o))}(n),a=Math.atan2(o.x,o.y);if(n.keyboard.space&&E.jump(),0!=n.touch.x&&0!=n.touch.y||n.keyboard.forward||n.keyboard.backward||n.keyboard.left||n.keyboard.right){t.z=E.scene.position.z+o.y,t.x=E.scene.position.x+o.x,E.velocity.x=(t.x-E.scene.position.x)/e,E.velocity.z=(t.z-E.scene.position.z)/e,t.y=E.scene.position.y;var c=new i.pb(t.x,t.y+1,t.z),r=new i.cb(c,new i.pb(0,-1,0)).intersectObjects(d,!0);r.length>0&&(t.y=r[0].point.y+.01),E.move(t,a),E.isRunning()||("equipped"==E.bowState?E.playAction("runWithBow"):E.playAction("running"))}else E.isRunning()?E.playAction("idle"):E.isAiming()&&E.rotate(a);n.keyboard.space&&(t=E.scene.position.clone().add(E.velocity.clone().multiplyScalar(e)),E.move(t))}},E.equipBow=function(){E.bowState="equipped",E.playAction("equipBow"),E.scene.children[0].children[1].visible=!1,E.scene.children[0].children[2].visible=!0},E.unequipBow=function(){E.scene.children[0].children[2].visible=!1,E.scene.children[0].children[1].visible=!0,E.bowState="unequipped"},E.takeDamage=function(){E.scene.position.y-=20},E.unequipBow(),E.playAction("idle")});var O=new i.U(75,window.innerWidth/window.innerHeight,.1,1e3);O.position.z=5;var C=new i.pb(0,1,0),D=0,P=0;O.nextPosition=function(e){if(null!=E){var n=new i.pb;return n.x=C.x+e*Math.sin(D*Math.PI/360)*Math.cos(P*Math.PI/360),n.y=C.y+e*Math.sin(P*Math.PI/360),n.z=C.z+e*Math.cos(D*Math.PI/360)*Math.cos(P*Math.PI/360),n}},O.setPosition=function(e){O.position.copy(e)},O.updateCamera=function(){if(null!=E){var e=E.scene.position.clone().sub(O.position.clone()),n=new i.pb(-e.z,0,e.x).normalize();C.copy(E.scene.position.clone().add(n)).setY(E.scene.position.y+1);var t=O.nextPosition(3.5),o=new i.cb(C,t.clone().sub(C).normalize(),0,5).intersectObjects(d,!0);o.length>0&&(t=o[0].point.clone().sub(t.clone().sub(o[0].point).normalize().multiplyScalar(.1))),O.setPosition(t)}O.lookAt(C),O.updateMatrix()},O.moveCamera=function(e,n){D-=.2*e;var t=P+.2*n;135>=t&&t>=-80&&(P=t),O.updateCamera()},t.d(n,"start",function(){return ne});var W=new i.h;document.body.appendChild(p.domElement),window.addEventListener("resize",function(){p.setSize(window.innerWidth,window.innerHeight),O.aspect=window.innerWidth/window.innerHeight,O.updateProjectionMatrix()});var X={keyboard:{forward:!1,backward:!1,left:!1,right:!1,space:!1},touch:{x:0,y:0}},Y="ready",R=!1,T={id:null,x:null,y:null,shoot:!1},H={id:null,x:null,y:null};function I(){requestAnimationFrame(I);var e=W.getDelta();L(e),E&&B&&(E.animate(e,X),B.update(e)),Object.keys(v.all()).length&&function(e){Object.keys(h).forEach(n=>{h[n].mixer&&h[n].mixer.update(e)})}(e),p.render(s,O)}function U(e,n){switch(e.key){case"w":X.keyboard.forward=n;break;case"a":X.keyboard.left=n;break;case"s":X.keyboard.backward=n;break;case"d":X.keyboard.right=n;break;case" ":X.keyboard.space=n}}function F(e){U(e,!0)}function J(e){U(e,!1)}function G(){"playing"===Y&&E.onMouseDown()}function K(){"playing"===Y&&E.onMouseUp()}function N(){"playing"!==Y&&(document.body.requestPointerLock(),Y="playing")}function Q(){document.pointerLockElement||(Y="ready")}function V(e){e!=R&&(e?shootButton.setAttribute("style","display: block;"+ee):shootButton.setAttribute("style","display: none;"+ee),R=e)}function Z(e){var n,t,o;e.preventDefault(),V(!0);for(var i=0;i<e.targetTouches.length;i++)e.targetTouches.item(i).identifier==T.id?n=e.targetTouches.item(i):e.targetTouches.item(i).identifier==H.id?t=e.targetTouches.item(i):null==o&&(o=e.targetTouches.item(i));n?(O.moveCamera(4*(n.pageX-T.x),4*(n.pageY-T.y)),T.x=n.pageX,T.y=n.pageY):o&&("shootButton"===o.target.id&&(E.onMouseDown(),T.shoot=!0),o.pageX>window.innerWidth/2&&(T.id=o.identifier,T.x=o.pageX,T.y=o.pageY)),t?(X.touch.x=t.pageX-H.x,X.touch.y=-1*(t.pageY-H.y)):o&&o.pageX<window.innerWidth/2&&(H.id=o.identifier,H.x=o.pageX,H.y=o.pageY)}function $(e){T.id==e.changedTouches[0].identifier?(T.shoot&&E.onMouseUp(),T.id=null,T.shoot=!1):H.id==e.changedTouches[0].identifier&&(H.id=null,X.touch={x:0,y:0})}function _(e){"shootButton"!=e.target.id&&V(!1);var n=e.movementX||e.mozMovementX||e.webkitMovementX||0,t=e.movementY||e.mozMovementY||e.webkitMovementY||0;O.moveCamera(n,t)}const ee="position: fixed; top: 50%; left: 85%; width: 50px; height: 50px; background-image: url(dot-and-circle.svg);";function ne(){document.addEventListener("mousemove",_),document.addEventListener("keydown",F),document.addEventListener("keyup",J),document.addEventListener("click",N),document.addEventListener("mousedown",G),document.addEventListener("mouseup",K),document.addEventListener("pointerlockchange",Q),document.addEventListener("touchstart",Z),document.addEventListener("touchmove",Z),document.addEventListener("touchend",$),I();var e=document.createElement("div");e.setAttribute("style","position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; background-image: url(crosshair.svg);"),document.body.appendChild(e);var n=document.createElement("div");n.setAttribute("id","shootButton"),n.setAttribute("style","display: none;"+ee),document.body.appendChild(n)}},,function(e,n,t){e.exports=t.p+"2ae2b1d71a866328a8288bfec6c0d60c.glb"},,function(e,n,t){e.exports=t.p+"baae041779d88e3f44e7b73d83d4b782.glb"}]]);