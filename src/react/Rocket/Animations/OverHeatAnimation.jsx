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
        if(temperature > MaxTemperature * 0.95){
            if(!this.HotWarningAudio){
                this.HotWarningAudio = playSound(WarningAudio, 1);

                this.HotWarningAudio.addEventListener('timeupdate', function(){
                    this.loop = true;
                });
            }else
                this.HotWarningAudio.volume = Math.min(this.HotWarningAudio.volume + 0.1, 1);     

        }else if(this.HotWarningAudio){
           this.HotWarningAudio.volume = Math.max(this.HotWarningAudio.volume - 0.1, 0);     
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
            else
                this.SystemFailureAudio.volume = Math.min(this.SystemFailureAudio.volume + 0.1, 1);     
                
            if(!this.AlarmAudio){
                this.AlarmAudio = playSound(Alarm, 1)

                this.AlarmAudio.addEventListener('timeupdate', function(){
                    this.loop = true;
                });
            }else
                this.AlarmAudio.volume = Math.min(this.AlarmAudio.volume + 0.1, 1);   

            super.Animate('/sprites/RocketOverHeat/Smoke/sprites', 70, 11);
        }
        else{         
            if(this.rocketImg.style.opacity){
                super.Animate('/sprites/RocketOverHeat/Smoke/sprites', 70, 11);
                this.rocketImg.style.opacity *= 0.99;
            }
            if(this.SystemFailureAudio)
                this.SystemFailureAudio.volume = Math.max(this.SystemFailureAudio.volume - 0.1, 0);     

            if(this.AlarmAudio){
                this.AlarmAudio.volume = Math.max(this.AlarmAudio.volume - 0.1, 0);              
            }
        }

    }

}