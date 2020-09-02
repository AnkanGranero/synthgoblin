 /* const menuValuesOld = {
    Gridsize: {

        name: "Grid size",
        x: {
            name:"X",
            type: "Slider",
            max:25,
            min:1,
        },
        y: {
            name:"Y",
            type: "Slider",
            max:25,
            min:1,
        }
    },
    Arpeggio: {
        name: "Arpeggio",

        minor: {
            name:"minor",
            type: "text"
        },
        major: {
            name:"major",
            type: "text"
        },
        custom: {
            name:"custom",
            type: "inputField"
        }
    },
    Angle: {
        name: "Angle",
        symetric: {
            name: "symetric",
            type: "text"
        },
        diatonic: {
            name: "diatonic",
            type: "text"
        }
    },
    MidiOut: {
        name: "Midi out",
        devices: {
            name:"devices",
            type:"midiOptions"
        },

    }
} */
const menuValues = {
    type: "text",
    values:[
    
    {   type: "component",
    component: "SliderContainer",
        name: "Grid size",
        values: [
            {
            name:"X",
            type: "component",
            component: "Slider",
            maxValue:25,
            minValue:1,
            initialValue: 15,
            integer: true

        },
         {
            name:"Y",
            type: "component",
            component: "Slider",
            maxValue:25,
            minValue:1,
            initialValue: 15,
            integer: true

        }
        ]
    },
    {
        name: "Arpeggio",
        type: "text",
        values: [{
            name:"minor",
            type: "text"
        },{
            name:"major",
            type: "text"
        }, {
            name:"custom",
            type: "component",
            component: "inputField"
        }

        ]
    }
      
  ]
}
export {menuValues}


//olika ljup i menuValues beroende på hur långt en har klickat in sig.
// om du har klickat in dig en nivå så är menuValues[nivå]