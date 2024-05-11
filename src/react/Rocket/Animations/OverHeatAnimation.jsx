import Animation from "./Animation"
import EngineFailure from '/audio/Engine/Failure/SystemFailure.mp3'
import Alarm from '/audio/Engine/Failure/AirCraftAlarm3.mp3'

function playSound(Obj, volume) {
    //  let audio = new Audio('file/pong.mp3');
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
    }

    play(temperature, MaxTemperature){
        if(temperature > MaxTemperature){
            if(this.rocketImg.style.opacity < 1){
                console.log(this.rocketImg.style.opacity)
                this.rocketImg.style.opacity += 0.1;
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