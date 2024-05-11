import Animation from "./Animation"
import EngineWorking from '/audio/Engine/engine_working_fit.mp3'

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
    }

    play(AccelerationPercentage, Accelerating){
    
        if(this.WorkingAudio)
            this.WorkingAudio.volume = Math.max(AccelerationPercentage, 0.1) ;
        else
            this.WorkingAudio = playSound(EngineWorking, 1)

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
           
            this.WorkingAudio.play();   

            if(this.currentSpriteIdx == 4)
                this.InitializedAcceleration = false;

            super.Animate('/sprites/RocketTurning/RocketTurningOn/sprites', 50, 4);
            return;
        }

        if(this.InitializedSlowDown){
            if(this.WorkingAudio)
                this.WorkingAudio.pause();   

            if(this.currentSpriteIdx == 4)
                this.InitializedSlowDown = false;

            super.Animate('/sprites/RocketTurning/RocketTurningOff/sprites', 100, 4);
            return;
        }


        
        if(Accelerating){

            if(this.WorkingAudio == null){
                this.WorkingAudio = playSound(EngineWorking, 1)
            }

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

