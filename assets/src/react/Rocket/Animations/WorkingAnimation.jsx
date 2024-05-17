import Animation from "./Animation"
import EngineWorking from '/audio/Engine/engine_working_fit.mp3'
import TurbineSound from '/audio/Engine/TurbineSound.mp3'

function playSound(Obj, volume) {
    //  let audio = new Audio('file/pong.mp3');
    var CurrentPlayingAudio= new Audio(Obj);
    CurrentPlayingAudio.volume = volume;
    CurrentPlayingAudio.play();
    return CurrentPlayingAudio;
}

export default class RocketWorkingAnimation extends Animation{

    constructor(){
        super();

        this.LastAcceleration = 0;
        this.InitializedAcceleration = 0;
        this.WorkingAudio = null;
        this.InitializedSlowDown = false;
        this.InitializedAcceleration = false;
        this.WasAccelerating = false;
    }

    pauseAudios(){
        if(this.WorkingAudio)
            this.WorkingAudio.pause();
        if(this.TurbineSound)
            this.TurbineSound.pause();
    }

    play(AccelerationPercentage, Accelerating){
    
 
        if(!this.WorkingAudio){
            this.WorkingAudio = playSound(EngineWorking, 1)
        }

        if(!this.TurbineSound){
            this.TurbineSound = playSound(TurbineSound, 1);
        }else{
            this.TurbineSound.volume = AccelerationPercentage * 0.6;

            //Correct time gap on loop
            this.TurbineSound.addEventListener('timeupdate', function(){
                var buffer = .44
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0
                    this.play()
                }
            });
        }

        if(this.WasAccelerating != Accelerating){

            if(Accelerating){
                //Initialize Accelerating animation
                if(this.InitializedSlowDown){    
                    this.InitializedSlowDown = false;
                }else
                    this.currentSpriteIdx = 0;

                this.InitializedAcceleration = true;
            }

            if(!Accelerating){
                //Initiate slow down animation;   
                if(this.currentSpriteIdx > 4)
                    this.currentSpriteIdx = 0;    

                this.InitializedSlowDown = true;
            } 
            
            this.WasAccelerating = Accelerating;
        }

        if(this.InitializedAcceleration){
           
            this.WorkingAudio.volume = Math.min(this.WorkingAudio.volume + 0.05, 1);

            if(this.currentSpriteIdx < 4){
                super.Animate('/sprites/RocketTurning/RocketTurningOn/sprites', 50, 4);
            }else if(this.WorkingAudio.volume == 1)
                this.InitializedAcceleration = false;

            return;
        }

        if(this.InitializedSlowDown){     
            this.WorkingAudio.volume = Math.max(this.WorkingAudio.volume - 0.05, 0);   
        
            if(this.currentSpriteIdx < 4 ){
                super.Animate('/sprites/RocketTurning/RocketTurningOff/sprites', 100, 4);
            }else if(!this.WorkingAudio.volume)
                this.InitializedSlowDown = false;

            return;
        }


        
        if(Accelerating){
           

            //Correct time gap on loop
            this.WorkingAudio.addEventListener('timeupdate', function(){
                var buffer = .44
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0
                    this.play()
                }
            });

            if(this.currentSpriteIdx >= 3)
                this.currentSpriteIdx = 0;

            let AnimationSpeed = 10 / AccelerationPercentage;

            super.Animate(`/sprites/RocketWorking/Sprites`, AnimationSpeed, 2, 50);
        }
    }

}

