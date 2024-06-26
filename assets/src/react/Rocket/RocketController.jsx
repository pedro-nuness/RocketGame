// controller.jsx
import Rocket from './Rocket.jsx'
import RocketSpriteController from './RocketAnimationController.jsx'


let RocketObj = document.getElementById("rocket");
let RocketIMG = document.getElementById("rocket_img");
let RocketHeight = RocketIMG.offsetHeight;
let Smoke = document.getElementById("rocket_smoke")


var SpaceShip = new Rocket(100, 1, 20 , 10000, 5, 10)

let RocketManager = new RocketSpriteController(SpaceShip);


let Root = document.getElementById("root");
console.log(Root.offsetWidth)
console.log(Root.offsetLeft)
const w = Root.offsetWidth + Root.offsetLeft;
const h = Root.offsetHeight + Root.offsetTop;

function CheckBorder(movementSize, elementSize, coord, flimit, nlimit = 0) {
    if (movementSize > 0) {
        if (coord + movementSize < flimit - elementSize) 
        return true;
    } else {
        if (coord + movementSize >= nlimit) 
        return true;
    }

    return false;
}



const CURRENT_STATE = {
    OFF: 1,
    TURNON: 2,
    IGNITION: 3,
    WORKING: 4,
    STARTING_BOOST: 5,
    WOKING_BOOST: 6,
    STOPPING_BOOST: 7,
    EXPLODED: 8
};

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default class Controller{

    constructor(currentPosX, currentPosY){
        this.X = currentPosX;
        this.Y = currentPosY;
        this.Roll = 0;

        this.Accelerate = false;
        this.Brake = false;
        this.TurnDirection = 2;
        this.CurrentSpriteIDX = 0;
    }

    

    RequestAdjustState(){
        switch(SpaceShip.GetCurrentState()){
            case CURRENT_STATE.OFF:          
                RocketIMG.src = "./sprites/RocketStartup/Sprites/sprite_0.png";  
            break;
            
            case CURRENT_STATE.IGNITION:      
                let AnimationStep = RocketManager.playIgnitionAnimation();
                switch(AnimationStep){
                    case 28:
                        return true;
                    case 24:
                        SpaceShip.SetVerticalSpeed(SpaceShip.max_speed * 0.05)
                        break;
                }

                SpaceShip.AdjustAcceleration(AnimationStep / 28);

                return false;
            break;

            case CURRENT_STATE.WORKING:
                RocketManager.playOverHeatAnimation(SpaceShip.GetCurrentTemperature(), SpaceShip.GetMaxTemperatureResistence());       
                if(SpaceShip.Exploded){
                    if(RocketManager.playExplostionAnimation()){
                        SpaceShip.current_rocket_state = CURRENT_STATE.EXPLODED;
                    }
                    return false;
                }else{
                    RocketManager.playWorkingAnimation(SpaceShip.current_acceleration_step / SpaceShip.max_acceleration, SpaceShip.OnAcceleration);
                    return true;   
                }

            
       } 
        
        return false;
    }

    AdjustPosition(){
       
        if(RocketObj != null){
            let VSpeed = -SpaceShip.GetVerticalSpeed() / 20;
            let HSpeed = SpaceShip.GetHorizontalSpeed() / 20;

            if (CheckBorder(VSpeed, RocketIMG.offsetHeight, this.Y, h, Root.offsetTop)) {
                this.Y += VSpeed ;
            }

            if (CheckBorder(HSpeed, RocketIMG.offsetWidth, this.X, w, Root.offsetLeft)) {
                this.X += HSpeed;
            }

            if(SpaceShip.GetHeight() > 2){
                RocketObj.style.rotate = SpaceShip.GetRotation() + "deg";
            }
                
            RocketObj.style.left = this.X + 'px';
            RocketObj.style.top = this.Y + 'px';

            Smoke.style.left = this.X + 'px';
            Smoke.style.top = this.Y + 'px';
            Smoke.style.rotate = SpaceShip.GetRotation() + "deg";
         
        }else
            console.log("null element!")
    }

    UpdateMovement(){
    
        switch(SpaceShip.GetCurrentState()){

            case CURRENT_STATE.EXPLODED:
              


            break;

            case CURRENT_STATE.WORKING:                  
                if(this.RequestAdjustState()){
                    if(this.TurnDirection !=2){
                        SpaceShip.Turn(this.TurnDirection);
                        RocketManager.playTurnAnimation();
                    }
                
                    if(this.Accelerate){
                        SpaceShip.Accelerate();
                    }
                    else{
                        SpaceShip.Deaccelerate();
                        
                        if(this.Brake)
                            SpaceShip.Brake();
                    }
                }
            break;
            
            case CURRENT_STATE.OFF:
                this.RequestAdjustState()
                if(this.Accelerate){
                    SpaceShip.NextStage();
                }
            break;

            case CURRENT_STATE.IGNITION:
                //if(this.RequestAdjustState())
                    SpaceShip.NextStage();
            break;
        }

        this.AdjustPosition();
        SpaceShip.AdjustHeight();  
    }

    ControlVelocimeter(Velocimeter, SpeedPercentage){
        //Starts on left, got do it for the right side, start on -89
        //Max = -89deg
        let Neddle = document.getElementById(Velocimeter);
        let Angle = ( SpeedPercentage * 1.25 ) * 2;
       
        if(SpeedPercentage >= 95){
            //Neddle shake on high speeds
            Angle += getRandomNumber(-1, 1);
        }

        Neddle.style.rotate = Angle + "deg";
    }

    ControlBar(Bar, Percentage){
        document.getElementById(Bar).style.height = Percentage + "%";
    }
};

//define screen limits
var Control = new Controller(w / 2, h - RocketHeight );

function calcularVelocidadeRealXY(velocidadeX, velocidadeY) {
    // Calcular a velocidade real usando o teorema de Pitágoras
    var velocidadeReal = Math.sqrt(Math.pow(velocidadeX, 2) + Math.pow(velocidadeY, 2));
    
    return velocidadeReal;
}


function Update(){

    let FixedHeight = SpaceShip.GetHeight() / 40;
    let FixedHorizontal = -SpaceShip.GetHorizontalPosition() / 40;
    document.body.style.backgroundPositionY = FixedHeight +'px';
    document.body.style.backgroundPositionX = FixedHorizontal +'px';

    let CurrentAcceleration = SpaceShip.GetCurrentAccelerationPercentage() * 100;
    let CurrentSpeed = calcularVelocidadeRealXY(SpaceShip.GetHorizontalSpeed(), SpaceShip.GetVerticalSpeed()) /  SpaceShip.GetMaxSpeed() * 100;

    Control.ControlVelocimeter("speed_neddle", CurrentSpeed);
    Control.ControlVelocimeter("acceleration_neddle", CurrentAcceleration);

    Control.ControlBar("aerodinamics", (SpaceShip.aerodinamics / SpaceShip.base_aerodinamics) * 100);
    Control.ControlBar("gas", (SpaceShip.Gas / SpaceShip.GasCapacity ) * 100);
    Control.ControlBar("temperature", ( SpaceShip.GetCurrentTemperature() / SpaceShip.GetMaxTemperatureResistence() ) * 100);

    Control.UpdateMovement();
  
}

document.addEventListener('keydown', function(e) {
        
    switch(e.key.toLowerCase()){
        case 'w':
            Control.Accelerate = true;
            break;
        case 's':
            Control.Brake = true;
            break;
        case 'a':
            Control.TurnDirection = 0;
        break;
        case 'd':
            Control.TurnDirection = 1;
            break;
    }
});

document.addEventListener('keyup', function(e) {
  
    switch(e.key.toLowerCase()){
        case 'w':
            Control.Accelerate = false;
        break;   
        case 's':
            Control.Brake = false;
        break;
        case 'a':
        case 'd':
            Control.TurnDirection = 2;
            break;
    }
});


setInterval(Update, 10);
