// controller.jsx
import Rocket from './Rocket.jsx'
import RocketSpriteController from './RocketStateController.jsx';

let RocketObj = document.getElementById("rocket");
let RocketIMG = document.getElementById("rocket_img");
let RocketHeight = RocketObj.offsetHeight;


var SpaceShip = new Rocket(1000, 1, 100, 1, 1)

let RocketManager = new RocketSpriteController(SpaceShip);

const w = document.getElementById("root").offsetWidth;
const h = document.getElementById("root").offsetHeight ;

function CheckBorder(movementSize, elementSize, coord, limit) {
    if (movementSize > 0) {
        if (coord + movementSize < limit - elementSize) 
        return true;
    } else {
        if (coord + movementSize >= 0) 
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
    STOPPING_BOOST: 7
};




class Controller{

    constructor(currentPosX, currentPosY){
        this.X = currentPosX;
        this.Y = currentPosY;
        this.Roll = 0;

        this.Accelerate = false;
        this.Brake = false;
        this.TurnDirection = 2;
        this.CurrentSpriteIDX = 0;
    }

 

    AdjustState(){
        switch(SpaceShip.GetCurrentState()){
            case CURRENT_STATE.OFF:          
                RocketIMG.src = "assets/sprites/RocketStartup/Sprites/sprite_0.png";  
            break;

            case CURRENT_STATE.IGNITION:
          
                switch(RocketManager.playIgnitionAnimation()){
                    case 28:
                        return true;
                    case 24:
                        SpaceShip.SetVerticalSpeed(10);
                        break;
                }
                return false;
       } 
        


        return false;
    }

    AdjustPosition(){
       
        if(RocketObj != null){
            let VSpeed = -SpaceShip.GetVerticalSpeed() / 10;
            let HSpeed = SpaceShip.GetHorizontalSpeed() / 10;

            if (CheckBorder(VSpeed, RocketObj.offsetHeight, this.Y, h)) {
                this.Y += VSpeed ;
            }

            if (CheckBorder(HSpeed, RocketObj.offsetWidth, this.X, w)) {
                this.X += HSpeed;
            }

            if(SpaceShip.GetHeight() > 2){
                RocketObj.style.rotate = SpaceShip.GetRotation() + "deg";
            }
                
            RocketObj.style.left = this.X + 'px';
            RocketObj.style.top = this.Y + 'px';
         
        }else
            console.log("null element!")
    }

    UpdateMovement(){
       
    
        switch(SpaceShip.GetCurrentState()){
            case CURRENT_STATE.WORKING:
                this.AdjustState()
                if(this.TurnDirection !=2){
                    SpaceShip.Turn(this.TurnDirection);
                }
            
                if(this.Accelerate){
                    SpaceShip.Accelerate();
                }
                else{
                    SpaceShip.Deaccelerate();
                    
                    if(this.Brake)
                        SpaceShip.Brake();
                }
            break;
            
            case CURRENT_STATE.OFF:
                this.AdjustState()
                if(this.Accelerate){
                    SpaceShip.NextStage();
                }
            break;

            case CURRENT_STATE.IGNITION:
                if(this.AdjustState())
                    SpaceShip.NextStage();
            break;

        }

      
        this.AdjustPosition();
        SpaceShip.AdjustHeight();  
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


    let CurrentAcceleration = SpaceShip.GetCurrentAccelerationPercentage() * 100;
    let CurrentSpeed = calcularVelocidadeRealXY(SpaceShip.GetHorizontalSpeed(), SpaceShip.GetVerticalSpeed()) /
     SpaceShip.GetMaxSpeed() * 100;

    document.getElementById("acceleration").style.height = CurrentAcceleration + "%";
    document.getElementById("speed").style.height = CurrentSpeed + "%";

    Control.UpdateMovement();
  
}

setInterval(Update, 10);
