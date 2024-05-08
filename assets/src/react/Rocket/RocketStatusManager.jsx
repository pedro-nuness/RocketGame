import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom

function GenerateStatus(type, message){
    switch(type){
        case "warning": 
        return (
            <> 
             <div className="rocket_status_box">
                <div className="rocket_status_img">
                <img className="rocket_status_img_warning" src="./img/waning.webp">
                </img>     
                </div>
        
                <span className ="rocket_status_text" id="rocket_status_text_warning">    
                    {`Warning: ${message}`}          
                </span>
            </div>
        </>);
        case "critical":
            return (
                <> 
                 <div className="rocket_status_box">
                    <div className="rocket_status_img">
                    <img className="rocket_status_img_error" src="./assets/img/error.png">
                    </img>     
                    </div>
                       
                    <span className ="rocket_status_text" id="rocket_status_text_error">  
                    {`Critical: ${message}`}                
                    </span>
                </div>
            </>);
    } 

   return null;
}

export default class RocketStatus {
    constructor(statusAreaId) {
        this.statusArea = document.getElementById(statusAreaId);
        this.root = createRoot(this.statusArea); // Create a root inside the statusArea
    }

    GenerateCriticalStatus(message) {
        const statusElement = GenerateStatus("critical", message);
        if (statusElement) {
            this.root.render(statusElement); // Render the statusElement into the root
        }
    }

    GenerateWarningStatus(message) {
        const statusElement = GenerateStatus("warning", message);
        if (statusElement) {
            this.root.render(statusElement); // Render the statusElement into the root
        }
    }
}
