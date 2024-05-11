
import RocketStartupAnimation from './Animations/StartupAnimation'
import RocketWorkingAnimation from './Animations/WorkingAnimation'
import OverHeatAnimation from './Animations/OverHeatAnimation';
import ExplostionAnimation from './Animations/ExplosionAnimation';



class RocketSpriteController {
    constructor(  ) {
        this.StartupAnimation = new RocketStartupAnimation;
        this.WorkingAnimation = new RocketWorkingAnimation;
        this.HeatAnimation = new OverHeatAnimation;
        this.ExplostionAnimation = new ExplostionAnimation;   

        this.ResetedAnimations = false;
    }

    playIgnitionAnimation() {
       return this.StartupAnimation.play();
    }

    playTurnAnimation(){
      
    }

    playOverHeatAnimation(temperature, MaxTemperature){
        this.HeatAnimation.play(temperature, MaxTemperature);
    }

    playExplostionAnimation(){  
        if(!this.ResetedAnimations){
            this.HeatAnimation.rocketImg.style.opacity = 0;
            this.ExplostionAnimation.rocketImg.style.height = '200%'
            this.WorkingAnimation.pauseAudios();
            this.HeatAnimation.pauseAudios();
            this.StartupAnimation.pauseAudios();
            this.ResetedAnimations = true;
        }
       
        return this.ExplostionAnimation.play();     
    }

    playAfterExplosionAnimation(){
        return this.HeatAnimation.playAfterExplosionAnimation();
    }

    playWorkingAnimation(AccelerationPercentage, Accelerating){
        this.WorkingAnimation.play(AccelerationPercentage, Accelerating);
    }
}


export default RocketSpriteController