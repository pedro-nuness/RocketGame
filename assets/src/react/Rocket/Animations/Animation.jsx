class Animation {

    constructor(){  
        this.currentSpriteIdx = 0;
        this.rocketImg = document.getElementById("rocket_img");
        this.lastUpdateTime = 0;
    }

    Animate(SpriteDir, AnimationSpeed, SpriteAmount, MinAnimationSpeed = 750){
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastUpdateTime;

        if (elapsedTime >= Math.min(AnimationSpeed, MinAnimationSpeed)) {
            this.currentSpriteIdx++;
            
            if (this.currentSpriteIdx > SpriteAmount) {
                this.currentSpriteIdx = 0;
            }
            this.lastUpdateTime = currentTime;
        }

        this.rocketImg.src = `${SpriteDir}/sprite_${this.currentSpriteIdx}.png`;
    }
}

export default Animation