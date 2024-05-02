
import EngineStart from '../../../audio/engine_start.mp3'
import EngineLaunch from '../../../audio/engine_launch.mp3'



function playSound(Obj, volume) {
    //  let audio = new Audio('file/pong.mp3');
    var CurrentPlayingAudio= new Audio(Obj);
    CurrentPlayingAudio.volume = volume;
    CurrentPlayingAudio.play();
    return CurrentPlayingAudio;
}

function calculateDeltaTime(previousTime) {
    const deltaTimeMs = new Date().getTime() - previousTime;
    const deltaTimeSec = deltaTimeMs / 1000; // Convert milliseconds to seconds
    return deltaTimeSec;
}

var SecondAudio;

class RocketSpriteController {
    constructor(  ) {
        this.rocketImg = document.getElementById("rocket_img");
        this.currentSpriteIdx = 0;
        this.intervalFunction = null;
        this.played_sound = false;
        this.InitiatedAnimation = false;
        this.now_time = 0;

    }

    playIgnitionAnimation() {
       
        if(!this.audio){
          this.audio = playSound(EngineStart, 1);
            this.now_time = new Date().getTime();
        }

        const deltaTime = calculateDeltaTime(this.now_time);
        if (deltaTime >= 13) {
            if(!this.intervalFunction){         
                    this.intervalFunction = setInterval(() => {
                        if (this.currentSpriteIdx < 28) {
                            this.currentSpriteIdx++;
                            console.log(this.currentSpriteIdx);
                            this.rocketImg.src = `assets/sprites/RocketStartup/Sprites/sprite_${this.currentSpriteIdx}.png`;
                        } else {
                            clearInterval(this.intervalFunction);
                            this.intervalFunction = null;
                            this.currentSpriteIdx = 0;
                        }
                    }, 100);
        
            }else {
                if(this.currentSpriteIdx >= 28){
                        clearInterval(this.intervalFunction);
                        this.intervalFunction = null;
                       
                }

              
    
            }
        }else if(deltaTime >= 12)
            if(!SecondAudio)
            SecondAudio = playSound(EngineLaunch, 0.7);

        return this.currentSpriteIdx;
    }

    

    setRocketSprite(spriteIdx) {
        this.currentSpriteIdx = spriteIdx;
        this.rocketImg.src = `assets/sprites/RocketStartup/Sprites/sprite_${this.currentSpriteIdx}.png`;
    }
}


export default RocketSpriteController