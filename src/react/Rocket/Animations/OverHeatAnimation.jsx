import Animation from "./Animation"
import EngineFailure from '/audio/Engine/Failure/SystemFailure.mp3'
import Alarm from '/audio/Engine/Failure/AirCraftAlarm3.mp3'
import WarningAudio from '/audio/ControlSystem/Warnings/Warning.mp3'

function playSound(Obj, volume = 1) {
    var CurrentPlayingAudio= new Audio(Obj);
    CurrentPlayingAudio.volume = volume;
    CurrentPlayingAudio.play();
    return CurrentPlayingAudio;
}

export default class OverHeatAnimation extends Animation{
    constructor(){
        super("rocket_smoke_img");
        this.SystemFailureAudio = null;
        this.AlarmAudio = null;
        this.HotWarningAudio = null;
    }

    pauseAudios(){
        if(this.AlarmAudio)
            this.AlarmAudio.pause();
        if(this.SystemFailureAudio)
            this.SystemFailureAudio.pause();
        if(this.HotWarningAudio)
            this.HotWarningAudio.pause();
    }

    playAfterExplosionAnimation(){
        if(this.currentSpriteIdx < 10){
            super.Animate('/sprites/RocketOverHeat/AfterSmoke/sprites', 70, 10);
        }
    }

    play(temperature, MaxTemperature){
        if(temperature > MaxTemperature * 0.8){
            if(!this.HotWarningAudio){
                this.HotWarningAudio = playSound(WarningAudio, 1);

                this.HotWarningAudio.addEventListener('timeupdate', function(){
                    this.loop = true;
                });
            }

        }else if(this.HotWarningAudio){
            this.HotWarningAudio.pause();     
        }  

        if(temperature > MaxTemperature){
            if(!this.rocketImg.style.opacity){
                this.rocketImg.style.opacity = 0.1;
            }
            else if(this.rocketImg.style.opacity < 1.0){
                this.rocketImg.style.opacity *= 1.1;
            }

            if(!this.SystemFailureAudio)
                this.SystemFailureAudio = playSound(EngineFailure, 1)
            if(!this.AlarmAudio){
                this.AlarmAudio = playSound(Alarm, 1)

                this.AlarmAudio.addEventListener('timeupdate', function(){
                    this.loop = true;
                });
            }

            super.Animate('/sprites/RocketOverHeat/Smoke/sprites', 70, 11);
        }
        else{         
            if(this.rocketImg.style.opacity){
                super.Animate('/sprites/RocketOverHeat/Smoke/sprites', 70, 11);
                this.rocketImg.style.opacity *= 0.99;
            }
            if(this.SystemFailureAudio)
                this.SystemFailureAudio.pause();

            if(this.AlarmAudio){
                this.AlarmAudio.addEventListener('timeupdate', function(){
                    this.loop = false;
                    this.pause();
                });            
            }
        }

    }

}