
import RocketStartupAnimation from './Animations/StartupAnimation'
import RocketWorkingAnimation from './Animations/WorkingAnimation'
import OverHeatAnimation from './Animations/OverHeatAnimation';


class RocketSpriteController {
    constructor(  ) {
        this.StartupAnimation = new RocketStartupAnimation;
        this.WorkingAnimation = new RocketWorkingAnimation;
        this.HeatAnimation = new OverHeatAnimation;
    }

    playIgnitionAnimation() {
       return this.StartupAnimation.play();
    }


    playTurnAnimation(){
      
    }

    playOverHeatAnimation(){
        this.HeatAnimation.play();
    }

    playWorkingAnimation(AccelerationPercentage, Accelerating){
        this.WorkingAnimation.play(AccelerationPercentage, Accelerating);
    }
}


export default RocketSpriteController