function parseUplink(device, payload)
{
	// This function allows you to parse the received payload, and store the 
	// data in the respective endpoints. Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device that produced the payload. 
	//   You can use "device.endpoints" to access the collection 
	//   of endpoints contained within the device. More information
	//   at https://wiki.cloud.studio/page/205
	// - payload: object containing the payload received from the device. More
	//   information at https://wiki.cloud.studio/page/208.

  // Payload is json
    var data = payload.asJsonObject();

    if (data.Type == "data")
    {
        // Thermostat data
        var ep = device.endpoints.byAddress("1");
        if (ep != null && data.mode != null && data.fanMode != null && data.setPoint !=null && data.ambientTemperature !=null){
            ep.updateHVACStatus(data.mode, data.fanMode, data.setPoint, data.ambientTemperature)
        }
    }

    if (data.Type == "response")
    {
        if (data.Success) 
        {
            device.respondCommand(data.CommandId, commandResponseType.success);
        }
        else 
        {
            device.respondCommand(data.CommandId, commandResponseType.error, data.ErrorMessage, data.ErrorCode);
        }
    }


}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	 payload.buildResult = downlinkBuildResult.ok; 
     switch (command.type) { 
	 	case commandType.thermostat: 
	 	 	switch (command.thermostat.type) { 
	 	 	 	
                case thermostatCommandType.setMode: 
                    var obj = { 
                            CommandId: command.commandId,
                            Command: "setMode",
                            Mode: command.thermostat.mode
                        };
                        payload.setAsJsonObject(obj);
                        payload.requiresResponse = true; 	 	 
	 	 	 	 	    break;
                    
	 	 	 	 case thermostatCommandType.setFanMode: 
	 	 	 	 	 var obj = { 
                            CommandId: command.commandId,
                            Command: "setFanMode",
                            FanMode: command.thermostat.fanMode
                        };
                        
                        payload.setAsJsonObject(obj);
                        payload.requiresResponse = true; 	 	 
	 	 	 	 	 break;

	 	 	 	 case thermostatCommandType.setSetpoint: 
                        env.log("Enviando setpoint con valor:", command.thermostat.setpoint);
                        var obj = { 
                            CommandId: command.commandId,
                            Command: "setPoint",
                            SetPoint: command.thermostat.setpoint
                        };
                        payload.setAsJsonObject(obj);
                        payload.requiresResponse = true; 	 	 
	 	 	 	 	    break;

                 case thermostatCommandType.setAll: 
	 	 	 	 	 var obj = { 
                        CommandId: command.commandId,
                        Command: "setAll",
                        Mode: command.thermostat.mode,
                        FanMode: command.thermostat.fanMode,
                        SetPoint: command.thermostat.setpoint
                    };
                    payload.setAsJsonObject(obj);
                    payload.requiresResponse = true; 	 
	 	 	 	 	break;

                default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	} 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	}

}