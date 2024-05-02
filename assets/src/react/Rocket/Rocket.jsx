
const Gravity = 0.1;
const AirFriction = 0.1;

const CURRENT_STATE = {
    OFF: 1,
    TURNON: 2,
    IGNITION: 3,
    WORKING: 4,
    STARTING_BOOST: 5,
    WOKING_BOOST: 6,
    STOPPING_BOOST: 7
};


class Rocket{

    constructor(max_acceleration, acceleration, max_speed, aerodinamics, brakeforce  ){
        //How faster the rocket will accelerate
        this.acceleration = acceleration;

        //How much the rocket will accelerate
        this.max_acceleration = max_acceleration

        //The max_speed of the rocket
        this.max_speed = max_speed;

        //Aerodinamics is like a little adjust
        //The higher the aerodinamics, it'll take longer to slow down
        //And will acellerate faster
        this.aerodinamics = aerodinamics;

        //CurrentStates of the rocket
        this.current_speed = 0;
        this.brakeforce = brakeforce;
        this.vertical_speed = 0;
        this.horizontal_speed = 0;
        this.current_height = 0;
        this.current_horizontal_position = 0;
        this.current_rocket_state = CURRENT_STATE.OFF;

        //This is used to regulate the direction of the movement
        this.current_rotation_angle = 0;
        this.turn_power = 1;
        this.current_acceleration_step = 0;
        this.rotation_radians = 0;
    }

    TurnBoost(){
        switch(this.current_rocket_state){
            case CURRENT_STATE.WORKING:
                this.current_rocket_state = CURRENT_STATE.STARTING_BOOST
            break;
            case CURRENT_STATE.STARTING_BOOST:
                this.current_rocket_state = CURRENT_STATE.WOKING_BOOST;
            break;
            case CURRENT_STATE.WOKING_BOOST:
                this.current_rocket_state = CURRENT_STATE.STOPPING_BOOST;
            break;
            case CURRENT_STATE.STOPPING_BOOST:
                this.current_rocket_state = CURRENT_STATE.WORKING;
            break;
        }
    }

    NextStage(){
        switch(this.current_rocket_state){
            case CURRENT_STATE.OFF:
                this.current_rocket_state = CURRENT_STATE.IGNITION;
            break;
            case CURRENT_STATE.IGNITION:
                this.current_rocket_state = CURRENT_STATE.WORKING;
            break;
            case CURRENT_STATE.IGNITION:
                this.current_rocket_state = CURRENT_STATE.WORKING;
            break;
        }
    }

    SetVerticalSpeed(speed){
        this.vertical_speed = speed;
    }

    SetHorizontalSpeed(speed){
        this.vertical_speed = speed;
    }

    GetCurrentSpeed() {
        return this.current_speed;
    }

    GetRotation(){
        return this.current_rotation_angle;
    }

    GetVerticalSpeed(){
        return this.vertical_speed;
    }

    GetCurrentAccelerationPercentage(){
        return this.current_acceleration_step / this.max_acceleration;
    }

    GetMaxSpeed(){
        return  this.max_speed;
    }

    GetHorizontalSpeed(){
        return this.horizontal_speed;
    }

    GetHeight(){
        return this.current_height;
    }

    GetCurrentState(){
        return this.current_rocket_state;
    }

    AdjustHeight(){    
        
        //km/h
        if(this.current_height + this.vertical_speed >= 0){
            this.current_height += this.vertical_speed ;
        }
      
        this.current_horizontal_position += this.horizontal_speed; 
       
        

        if(this.current_height < 0)
            this.current_height = 0;
    }


    Turn(direction){
        switch(direction){
            //We have to add the rotation resistance, based on speed
            case 1:        
                this.current_rotation_angle += this.turn_power;
                break
            case 0:
                this.current_rotation_angle -=  this.turn_power;           
                break;
        }

          // Garantir que a rotação esteja entre -180 e 180 graus
        if (this.current_rotation_angle > 180) {
            this.current_rotation_angle -= 360;
        } else if (this.current_rotation_angle < -180) {
            this.current_rotation_angle += 360;
        }
    }

    AdjustRotation(){
       
    }

    AdjustSpeed(){
        //Adjust the speed acording to the current acceleration step
        //The current speed uses a logic based on %, it takes the max speed and the acceleration as reference
        this.current_speed = this.max_speed * (this.current_acceleration_step / this.max_acceleration);

        this.AdjustRotation();

          // Converter o ângulo de graus para radianos
        this.rotation_radians = this.current_rotation_angle * Math.PI / 180;
        if(this.current_height > 5)
            this.vertical_speed -= Gravity * 0.2;

            this.AdjustRotation();
    }

    Brake(){
        if(this.current_acceleration_step > this.brakeforce)
            this.current_acceleration_step -= this.brakeforce;
        else
           this.current_acceleration_step = 0;

    }

    Accelerate(){
    
        //increse the acceleration step
        //added checks, so we don't extrapolate max speed     
        if(this.current_acceleration_step < this.max_acceleration - this.acceleration * this.aerodinamics){
            this.current_acceleration_step += this.acceleration * this.aerodinamics;
        }
        else
            this.current_acceleration_step = this.max_acceleration;

        this.AdjustSpeed();

        // Calculate the change in speed based on the acceleration
        const deltaVerticalSpeed = this.current_speed * Math.cos(this.rotation_radians);
        const deltaHorizontalSpeed = this.current_speed * Math.sin(this.rotation_radians);

        // Update the vertical and horizontal speeds based on the change
        this.vertical_speed += (deltaVerticalSpeed - this.vertical_speed) * this.current_acceleration_step / this.max_acceleration;
        this.horizontal_speed += (deltaHorizontalSpeed - this.horizontal_speed) * this.current_acceleration_step / this.max_acceleration;
    }

    Deaccelerate(){    
        //decrease the acceleration step
          //added checks, so we don't get acceleration under 0
        if(this.current_acceleration_step - this.acceleration / this.aerodinamics > 0)
            this.current_acceleration_step -= this.acceleration / this.aerodinamics;
        else
        this.current_acceleration_step = 0;
      

        // Calculate the new rotation angle based on the current vertical and horizontal speeds
      


        this.AdjustSpeed();
    }
    

}



export default Rocket