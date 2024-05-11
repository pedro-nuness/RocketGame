import Animation from "./Animation";

export default class ExplostionAnimation extends Animation{
    constructor(){
        super();
    }

    play(){
        if(this.currentSpriteIdx == 9){
            this.rocketImg.style.opacity = 0;
            return true;
        }
        super.Animate('/sprites/RocketOverHeat/Explosion/sprites', 70, 9);
    }



}