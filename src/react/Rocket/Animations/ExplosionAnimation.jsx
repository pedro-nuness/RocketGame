import Animation from "./Animation";
import ExplosionAudio from '/audio/Engine/Failure/explosion.mp3'

function playSound(Obj, volume = 1) {
    //  let audio = new Audio('file/pong.mp3');
    var CurrentPlayingAudio= new Audio(Obj);
    CurrentPlayingAudio.volume = volume;
    CurrentPlayingAudio.play();
    return CurrentPlayingAudio;
}

export default class ExplostionAnimation extends Animation{
    constructor(){
        super();
        this.audio = null;
    }

    play(){
        if(!this.audio){
            this.audio = playSound(ExplosionAudio);
        }

        if(this.currentSpriteIdx >= 9){
            this.rocketImg.style.opacity = 0;
            return true;
        }

        super.Animate('/sprites/RocketOverHeat/Explosion/sprites', 70, 9);
        return false;
    }



}