import RocketStatus from "./RocketStatusManager"

var RocketManager = new RocketStatus("rocket_status_area");

const Gravity = 5;
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

// Função para calcular o ângulo em graus entre -180 e 180
function calcularAngulo(velocidadeHorizontal, velocidadeVertical) {
    // Calcula o ângulo em radianos usando a função atan2
    var radianos = Math.atan2(velocidadeHorizontal, velocidadeVertical);

    // Converte de radianos para graus
    var graus = radianos * (180 / Math.PI);
    // Ajusta o ângulo para o intervalo de -180 a 180 graus
    if (graus > 180) {
        graus -= 360;
    } else if (graus < -180) {
        graus += 360;
    }
    // Retorna o ângulo ajustado em graus
    return graus;
}


function calcularVelocidadeRealXY(velocidadeX, velocidadeY) {
    // Calcular a velocidade real usando o teorema de Pitágoras
    var velocidadeReal = Math.sqrt(Math.pow(velocidadeX, 2) + Math.pow(velocidadeY, 2));
    
    return velocidadeReal;
}


export default class Rocket{

    constructor(max_acceleration, acceleration, acceleration_power, max_speed, aerodinamics, brakeforce  ){
        //How faster the rocket will accelerate
        this.acceleration = acceleration;

        //How much the rocket will accelerate
        this.max_acceleration = max_acceleration

        //The max_speed of the rocket
        this.max_speed = max_speed;

        //Aerodinamics is like a little adjust
        //The higher the aerodinamics, it'll take longer to slow down
        //And will acellerate faster
        this.base_aerodinamics = aerodinamics;
        this.aerodinamics = 0;

        this.MaxHeatResistence = 10000;

        //CurrentStates of the rocket
        this.current_speed = 0;
        this.brakeforce = brakeforce;
        this.vertical_speed = 0;
        this.horizontal_speed = 0;
        this.current_height = 0;
        this.current_horizontal_position = 0;
        this.current_rocket_state = CURRENT_STATE.OFF;
        this.acceleration_power = acceleration_power;


        //This is used to regulate the direction of the movement
        this.current_rotation_angle = 0;
        this.turn_power = 1;
        this.current_acceleration_step = 0;
        this.rotation_radians = 0;
        this.OnAcceleration = false;
        this.WorldTemperature = 24;
        this.CurrentTemperature = 0;
        this.Exploded = false;
        this.GasCapacity = 1000;
        this.Gas = 1000;
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
        }
    }

    AdjustHeight() {
        // Gradually adjust the rotation angle
        const targetRotationAngle = calcularAngulo(this.horizontal_speed, this.vertical_speed);
        let angleDifference = Math.abs(targetRotationAngle - this.current_rotation_angle);
    
        // Ajustar a diferença angular para estar no intervalo de 0 a 180 graus
        if (angleDifference > 180) {
            angleDifference = 360 - angleDifference;
        }
    
        // Quanto menor a diferença angular, maior a aerodinâmica
        // Invertendo a lógica para que a aerodinâmica seja maior quando o ângulo for menor
        this.aerodinamics = this.base_aerodinamics * (1 - angleDifference / 180);
    
        //km/h
        let VMMs = (this.vertical_speed);
        let HMMs = (this.horizontal_speed);
    
        if (this.current_height + VMMs >= 0) {
            this.current_height += VMMs;
        } else {
            this.current_height = 0;
            // Crashed, then we initiate explosion animation
            if (Math.abs(this.current_rotation_angle) > 5) {
                this.vertical_speed = 0;
                this.horizontal_speed = 0;
                this.Exploded = true;
            }
        }
    
        if (this.CurrentTemperature > this.MaxHeatResistence * 3){
            this.Exploded = true;
        }
    
        if (this.Exploded) { 
            this.CurrentTemperature = 24;    
            this.current_acceleration_step = 0;
            this.vertical_speed *= 0.95;
            this.horizontal_speed *= 0.95;
        } else if (this.current_height > 0) {
            if (this.vertical_speed < this.max_speed * 0.9) {
                if (this.vertical_speed < this.max_speed * 0.3)
                    RocketManager.GenerateCriticalStatus("Low speed")
                else if (this.vertical_speed < this.max_speed * 0.65)
                    RocketManager.GenerateWarningStatus("Low speed")
            }
        }
    
        this.current_horizontal_position += HMMs;
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

        this.AdjustRotation();

        
    }

    AdjustAcceleration(AccelerationPercentage){
        this.current_acceleration_step = this.max_acceleration * AccelerationPercentage;
    }

    AdjustRotation(){
       
          // Garantir que a rotação esteja entre -180 e 180 graus
          if (this.current_rotation_angle > 180) {
            this.current_rotation_angle -= 360;
        } else if (this.current_rotation_angle < -180) {
            this.current_rotation_angle += 360;
        }

        // Converter o ângulo de graus para radianos
        this.rotation_radians = this.current_rotation_angle * Math.PI / 180;
    }

    ApplyResistence(){
        if(this.current_height > 5){
            this.vertical_speed -= Gravity * 0.2;
            if(this.horizontal_speed.toFixed() >= 1){
                this.horizontal_speed -= AirFriction * Math.cos(this.rotation_radians);
            }
        }
    }

    calculateTemperature(accelerationFactor) {
        // Constantes (ajuste conforme necessário)
        const coeficienteDeArrasto = 0.5;
        const densidadeDoAr = 1.225; // kg/m^3 ao nível do mar
        const areaFrontal = 1.0; // m^2, ajuste conforme o tamanho do foguete
        const fatorDeConversao = 0.01; // Arbitrário para simplificação
    
        // Calcular o arrasto (drag)
        var arrasto = 0.5 * coeficienteDeArrasto * densidadeDoAr * Math.pow(this.current_speed / 36, 2) * areaFrontal;
    
        // Calcular a temperatura devido ao arrasto
        var temperaturaArrasto = arrasto * fatorDeConversao; // Fator de conversão para temperatura
    
        // Ajustar a contribuição da aceleração
        temperaturaArrasto *= accelerationFactor;
    
        // Calcular a temperatura final do foguete
        var temperaturaFinal = this.CurrentTemperature + temperaturaArrasto;
    
        return temperaturaFinal;
    }
    
    CoolDown() {
        // Simula a dissipação de calor, ajustando conforme necessário
        const coolingRate = 0.999; // Fator de resfriamento
        this.CurrentTemperature = Math.max(this.WorldTemperature, this.CurrentTemperature * coolingRate);
    }
    
    AdjustSpeed(){
        //Adjust the speed acording to the current acceleration step
        //The current speed uses a logic based on %, it takes the max speed and the acceleration as reference
        this.current_speed = calcularVelocidadeRealXY(this.vertical_speed, this.horizontal_speed);
        
         
       
        this.AdjustRotation();    
        this.ApplyResistence();

        // Atualiza a temperatura atual do foguete
        if (this.OnAcceleration) {
            this.CurrentTemperature = this.calculateTemperature(0.5); // Considera meio passo de aceleração
        } else {
            this.CoolDown();
        }
    }



    Brake(){
        this.CurrentTemperature *= 0.95;
        this.OnAcceleration = false;
        if(this.current_acceleration_step > this.brakeforce)
            this.current_acceleration_step -= this.brakeforce;
        else
           this.current_acceleration_step = 0;

    }

    Accelerate() {
        this.OnAcceleration = true;
        document.getElementById("rocket").style.transition = "0s";

        // Incrementa o passo de aceleração, respeitando a velocidade máxima
        this.current_acceleration_step = Math.min(this.current_acceleration_step + (this.acceleration * this.acceleration_power), this.max_acceleration);
        this.AdjustSpeed();

        // Atualiza as velocidades vertical e horizontal com base na aceleração atual
        this.vertical_speed = Math.min(this.vertical_speed + (this.acceleration_power * (this.current_acceleration_step / this.max_acceleration)) * Math.cos(this.rotation_radians), this.max_speed);
        this.horizontal_speed = Math.min(this.horizontal_speed + (this.acceleration_power * (this.current_acceleration_step / this.max_acceleration)) * Math.sin(this.rotation_radians), this.max_speed);

        // Atualiza a temperatura atual do foguete
        this.CurrentTemperature = this.calculateTemperature(1.0); // Considera aceleração total
    }

    Deaccelerate() {
        this.OnAcceleration = false;

        // Diminui o passo de aceleração, respeitando o limite inferior de zero
        this.current_acceleration_step = Math.max(this.current_acceleration_step - (this.acceleration / this.acceleration_power), 0);
        this.AdjustSpeed();

        // Gradually adjust the rotation angle
        const targetRotationAngle = calcularAngulo(this.horizontal_speed, this.vertical_speed);
        const rotationStep = 0.1; // Ajuste conforme necessário
        if (Math.abs(this.current_rotation_angle - targetRotationAngle) > rotationStep) {
            if (this.current_rotation_angle < targetRotationAngle) {
                this.current_rotation_angle += rotationStep;
            } else {
                this.current_rotation_angle -= rotationStep;
            }
        } else {
            this.current_rotation_angle = targetRotationAngle;
        }
        this.AdjustRotation();

        // Resfria a temperatura atual do foguete
        this.CoolDown();
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

    GetHorizontalPosition(){
        return this.current_horizontal_position;
    }

    GetCurrentState(){
        return this.current_rocket_state;
    }

    GetCurrentTemperature(){
        return this.CurrentTemperature;
    }

    GetMaxTemperatureResistence(){
        return this.MaxHeatResistence;
    }


}



