
import RocketStartupAnimation from './Animations/StartupAnimation'
import RocketWorkingAnimation from './Animations/WorkingAnimation'


class RocketSpriteController {
    constructor(  ) {
        this.StartupAnimation = new RocketStartupAnimation;
        this.WorkingAnimation = new RocketWorkingAnimation;
    }

    playIgnitionAnimation() {
       return this.StartupAnimation.play();
    }


    playTurnAnimation(){
      
    }

    playWorkingAnimation(AccelerationPercentage, Accelerating){
        this.WorkingAnimation.play(AccelerationPercentage, Accelerating);
    }
}


export default RocketSpriteController