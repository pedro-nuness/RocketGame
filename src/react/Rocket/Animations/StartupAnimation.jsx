import Animation from "./Animation"
import EngineStart from "/audio/Engine/engine_start.mp3"
import EngineStartCombustion from "/audio/Engine/engine_launch_fit.mp3"


function calculateDeltaTime(previousTime) {
    const deltaTimeMs = new Date().getTime() - previousTime;
    const deltaTimeSec = deltaTimeMs / 1000; // Convert milliseconds to seconds
    return parseFloat(deltaTimeSec.toFixed(2)); // Round the result to the specified number of decimal places
}

function playSound(Obj, volume) {
    //  let audio = new Audio('file/pong.mp3');
    var CurrentPlayingAudio= new Audio(Obj);
    CurrentPlayingAudio.volume = volume;
    CurrentPlayingAudio.play();
    return CurrentPlayingAudio;
}


export default class RocketStartupAnimation extends Animation {
    constructor() {
        super();
        this.audio = null;
        this.IgnitionAudio = null;
        this.currentSpriteIdx = 0;
        this.startTime = 0;
    }

    pauseAudios(){
        if(this.audio)
            this.audio.pause();
        if(this.IgnitionAudio)
            this.IgnitionAudio.pause();
    }

    play() {

        if (!this.audio) {
            this.audio = playSound(EngineStart, 1);
            this.startTime = new Date().getTime();
        }

        
        let deltaTime = calculateDeltaTime(this.startTime);
        if(deltaTime >= 13)
            super.Animate('/sprites/RocketStartup/Sprites/', 100, 28);

        switch (deltaTime) {
            case 12:
                if(!this.IgnitionAudio)
                this.IgnitionAudio = playSound(EngineStartCombustion, 0.7)
                // Reproduzir o segundo áudio de ignição
                break;
        }

        if (this.currentSpriteIdx >= 28) {
            clearInterval(this.intervalFunction);
            this.intervalFunction = null;
            this.currentSpriteIdx = 0;
            return 28;
        }

        return this.currentSpriteIdx;
    }
}
