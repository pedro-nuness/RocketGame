
import RocketStartupAnimation from './Animations/StartupAnimation'
import RocketWorkingAnimation from './Animations/WorkingAnimation'
import OverHeatAnimation from './Animations/OverHeatAnimation';
import ExplostionAnimation from './Animations/ExplosionAnimation';

import WarningAudio from '/audio/ControlSystem/Warnings/Warning.mp3'

function playSound(Obj, volume) {
    //  let audio = new Audio('file/pong.mp3');
    var CurrentPlayingAudio= new Audio(Obj);
    CurrentPlayingAudio.volume = volume;
    CurrentPlayingAudio.play();
    return CurrentPlayingAudio;
}

class RocketSpriteController {
    constructor(  ) {
        this.StartupAnimation = new RocketStartupAnimation;
        this.WorkingAnimation = new RocketWorkingAnimation;
        this.HeatAnimation = new OverHeatAnimation;
        this.ExplostionAnimation = new ExplostionAnimation;

        this.HotWarningAudio = null;
        
    }

    playIgnitionAnimation() {
       return this.StartupAnimation.play();
    }

    StateGettingHot(){
        if(!this.HotWarningAudio)
            this.HotWarningAudio = playSound(WarningAudio, 1);

        this.HotWarningAudio.addEventListener('timeupdate', function(){
            if(this.ended ){
                this.currentTime = 0
                this.play()
            }
        });
    }

    playTurnAnimation(){
      
    }

    playOverHeatAnimation(temperature, MaxTemperature){
        this.HeatAnimation.play(temperature, MaxTemperature);
    }

    playExplostionAnimation(){
        return this.ExplostionAnimation.play();
    }

    playWorkingAnimation(AccelerationPercentage, Accelerating){
        this.WorkingAnimation.play(AccelerationPercentage, Accelerating);
    }
}


export default RocketSpriteController