import * as THREE from 'three';

class Fish {
    fishG = new THREE.Group();
    eyeGroup = new THREE.Group();
    fishTailMovementShrink = [];
    fishTailMovementExpend = [];
    tailPosition = 0; 
    tailUp = true;
    doneShrinking = false;
    doneExpending = false;
    shrinkAnimation = true;
    swimBack = false;
    scene;
    moveSpeed = 0.3;
    constructor(scene, moveSpeed) {
        this.scene = scene;
        this.moveSpeed = moveSpeed;
        const eyeGeomatry = new THREE.SphereGeometry(0.28, 25, 25);
        const eyeMaterial = new THREE.MeshStandardMaterial({color: 0XFFFFFF})
        this.eyeMesh = new THREE.Mesh( eyeGeomatry, eyeMaterial );
        const pupilGeomatry = new THREE.SphereGeometry(0.13, 25, 25);
        const pupilMaterial = new THREE.MeshStandardMaterial({color: 0X000000})
        this.pupilMesh = new THREE.Mesh( pupilGeomatry, pupilMaterial );
    }
    create(fishX=null, fishY=null) {
        let end= 0.1;
        let start = 0.1;
        let fishGeomatry;
        let fishMesh;
        let colors = [ 0Xf88101,0Xe17000,0Xe17000,0Xe17000,0Xe17000,0xFFFFFF,0Xe17000,0Xe17000,0Xe17000,0Xe17000,0xFFFFFF,0Xe17000,0Xe17000,0xFFFFFF,0Xe17000,0Xe17000]

        

        for(let i=1; i<15; i++){
            // const fishMaterial = new THREE.MeshStandardMaterial({color: colors[i]})
            const fishMaterial = new THREE.MeshStandardMaterial({color: colors[i]})
            start = end;
            end = Math.sin(i/4);
            fishGeomatry = new THREE.CylinderGeometry( start, end, 0.2, 32 );
        
            fishMesh = new THREE.Mesh( fishGeomatry, fishMaterial );
            fishMesh.position.y = 0.2*-i;
            if (i === 14) {
            let currentStart = +start;
            let currentEnd = +end;
            this.fishTailMovementShrink.push(fishMesh);
            this.fishTailMovementExpend.push(fishMesh);
            for (let j = 1; j < 24; j++ ) {
                currentStart += 0.008;
                currentEnd += 0.01;
                const currentFishTailGeo = new THREE.CylinderGeometry( currentStart, currentEnd, 0.2, 32 );
                const currentFishTailMesh = new THREE.Mesh( currentFishTailGeo, fishMaterial );
                currentFishTailMesh.position.y = 0.2*-i;
                this.fishTailMovementShrink.push(currentFishTailMesh);
            }
            currentStart = +start;
            currentEnd = +end;
            for (let j = 1; j < 24; j++ ) {
                currentStart -= 0.01;
                currentEnd -= 0.01;
                const currentFishTailGeo = new THREE.CylinderGeometry( currentStart, currentEnd, 0.2, 32 );
                const currentFishTailMesh = new THREE.Mesh( currentFishTailGeo, fishMaterial );
                currentFishTailMesh.position.y = 0.2*-i;
                this.fishTailMovementExpend.push(currentFishTailMesh);
            }
            }
            if (i === 3) {
                this.eyeMesh.position.set(fishMesh.position.x-0.6, fishMesh.position.y+0.67, fishMesh.position.z+0.5);
                this.pupilMesh.position.set(fishMesh.position.x-0.6, fishMesh.position.y+0.67, fishMesh.position.z+0.9);
                this.eyeGroup.add(this.eyeMesh)
                this.eyeGroup.add(this.pupilMesh);
                this.scene.add(this.eyeGroup);
            }
            fishMesh.name = "cyc"+start+"_"+end;
            this.fishG.add(fishMesh);
            
        }
        this.fishG.rotateZ(80.1);
        this.fishG.position.x = fishX ? fishX : 0;
        this.eyeGroup.position.x = fishX ? fishX : 0;
        this.fishG.position.y = fishY ? fishY : 0;
        this.eyeGroup.position.y = fishY ? fishY : 0;
        this.scene.add(this.fishG);
    }
    animate() {
        this.fishG.position.x += (this.swimBack ? -this.moveSpeed : this.moveSpeed);
        this.eyeGroup.position.x += (this.swimBack ? -this.moveSpeed : this.moveSpeed);
        if (this.fishG.position.x >= 8) {
            this.rotateFish();
        }
        if (this.fishG.position.x <= -8) {
            this.rotateFish();
        }
        this.adjustFishTail();
    }

    rotateFish() {
        this.fishG.rotateZ(9.41);
        this.eyeGroup.rotateZ(9.43);
        if (!this.swimBack) {
            this.eyeGroup.position.y += 0.2;
        } else {
            this.eyeGroup.position.y -= 0.2;
        }
        this.swimBack = !this.swimBack;
    }
      
      adjustFishTail() {
        if (this.shrinkAnimation) {
            this.shrinkTailAnimation();
        } else {
            this.expendTailAnimation();
        }
      }
      
      shrinkTailAnimation() {
        if (this.tailPosition === this.fishTailMovementShrink.length - 1) {
            this.tailUp = false;
            this.doneShrinking = true;
        }
        this.fishG.remove(this.fishTailMovementShrink[this.tailPosition]);
        this.tailPosition = this.tailPosition + (this.tailUp ? 1 : -1);
        this.fishG.add(this.fishTailMovementShrink[this.tailPosition]);
        if (this.tailPosition === 0 && this.doneShrinking) {
            this.tailUp = true;
            this.doneShrinking = false;
            this.shrinkAnimation = false;
        }
      }
      
      expendTailAnimation() {
        if (this.tailPosition === this.fishTailMovementExpend.length - 1) {
            this.tailUp = false;
            this.doneExpending = true;
        }
        this.fishG.remove(this.fishTailMovementExpend[this.tailPosition]);
        this.tailPosition = this.tailPosition + (this.tailUp ? 1 : -1);
        this.fishG.add(this.fishTailMovementExpend[this.tailPosition]);
        if (this.tailPosition === 0 && this.doneExpending) {
            this.tailUp = true;
            this.doneExpending = false;
            this.shrinkAnimation = true;
        }
      }
}
export default Fish;