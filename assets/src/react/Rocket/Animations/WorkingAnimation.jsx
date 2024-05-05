import Animation from "./Animation"
import EngineWorking from '../../../../audio/Engine/engine_working_fit.mp3'

function playSound(Obj, volume) {
    //  let audio = new Audio('file/pong.mp3');
    var CurrentPlayingAudio= new Audio(Obj);
    CurrentPlayingAudio.volume = volume;
    CurrentPlayingAudio.play();
    return CurrentPlayingAudio;
}

class RocketWorkingAnimation extends Animation{

    constructor(){
        super();

        this.LastAcceleration = 0;
        this.InitializedAcceleration = 0;
        this.WorkingAudio = null;
        this.InitializedSlowDown = false;
        this.InitializedAcceleration = false;
    }

    play(AccelerationPercentage){
    
        if(this.WorkingAudio)
            this.WorkingAudio.volume = Math.max(AccelerationPercentage, 0.1) ;
        else
            this.WorkingAudio = playSound(EngineWorking, 1)

        if(this.LastAcceleration != AccelerationPercentage){

            if(AccelerationPercentage && !this.LastAcceleration){
                //Initiate accelerate animation
              
                if(this.InitializedSlowDown){    
                    this.InitializedSlowDown = false;
                }else
                    this.currentSpriteIdx = 0;

                this.InitializedAcceleration = true;
            }

            if(!AccelerationPercentage && this.LastAcceleration){
                //Initiate slow down animation;   
                if(this.currentSpriteIdx > 4)
                    this.currentSpriteIdx = 0;        
                this.InitializedSlowDown = true;
                console.log(5);
            } 
            
            this.LastAcceleration = AccelerationPercentage;
        }

        if(this.InitializedSlowDown){
            if(this.WorkingAudio)
                this.WorkingAudio.pause();   

            if(this.currentSpriteIdx == 4)
                this.InitializedSlowDown = false;

            super.Animate(`assets/sprites/RocketTurning/RocketTurningOff/sprites`, 100, 4);
            console.log(4);
            return;
        }

        if(this.InitializedAcceleration){

            if(this.WorkingAudio)
                this.WorkingAudio.play();   
            if(this.currentSpriteIdx == 4){
                this.InitializedAcceleration = false;
                SecondIgnitionAudio = null;
             
            }
            
            super.Animate(`assets/sprites/RocketTurning/RocketTurningOn/sprites`, 50, 4);
            return;
        }

        
        if(AccelerationPercentage){

            console.log(2);

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

            this.rocketImg.src = `assets/sprites/RocketWorking/Sprites/sprite_${this.currentSpriteIdx}.png`;

            let AnimationSpeed = 10 / AccelerationPercentage;

            super.Animate(`assets/sprites/RocketWorking/Sprites`, AnimationSpeed, 2, 50);
        }

    }

}

export default RocketWorkingAnimation