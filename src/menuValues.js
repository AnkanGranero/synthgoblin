
const menuValues = {
    type: "text",
    values:[

    {   type: "component",
    component: "SliderContainer",
        name: "Grid size",
        values: [
            {
            name:"x",
            type: "component",
            component: "Slider",
            valueType:"GridSize",
            maxValue:25,
            minValue:1,
            initialValue: 15,
            integer: true,
            action: "changeGridSize"

        },
         {
            name:"y",
            type: "component",
            valueType:"GridSize",
            component: "Slider",
            maxValue:25,
            minValue:1,
            initialValue: 15,
            integer: true,
            action: "changeGridSize"

        }
        ]
    },
    {
        name: "Arpeggio",
        type: "text",
        values: [{
            name:"minor",
            action:"changeArpeggio",
            payload: [3, 4, 3, 2]


        },{
            name:"major",
            action:"changeArpeggio",
            payload: [4, 3, 4, 1]

        }, {
            name:"custom",
            type: "component",
            component: "inputField",
            action: "changeArpeggio",
            message: "Write intervals in semitones",
            closeAfterChoice: true
        }

        ]
    },
    {

        name: "Angle",
        type: "text",
        values: [
           {
            name: "symetric",
            action: "changeAngle",
            payload: "symetric",
           },
           {
            name: "diatonic",
            action: "changeAngle",
            payload: "diatonic"

           },
    ]

    },
    {
        name: "Midi out",
        type: "text",

        values: [
            {
              name: "Midi out:",
              type: "toggle",
              action: "toggleMidiOutActive"
            },
            {
              name: "Midi outputs",
              type: "component",
              component: "MidiOutputs",
            },
            {
              name: "Midi channel",
              type: "component",
              component: "inputField",
              message: "Select midi output channel",
              action: "setMidiOutputChannel",
              singleInteger: true,
              min:1,
              max: 16,
              method: "setOutputChannel"
            },

            {
                name: "Midi note properties",
                type: "component",
                component: "MidiOptionSliders",
                values: [
            {
            name:"Velocity",
            type: "component",
            component: "Slider",
            valueType:"Midi",
            maxValue:1,
            minValue:0,
            initialValue: 0,
            integer: false,
            method: "changeMidiNoteVelocity"

        },
         {
            name:"NoteLength",
            type: "component",
            component: "Slider",
            valueType:"Midi",
            maxValue:1,
            minValue:0,
            initialValue: 0,
            integer: false,
            method: "changeMidiNoteLength"

                    }
                ]
            }
        ]
    },
    {
        name: "Color theme",
        type: "text",

        values: [
                    {
                    name: "Classic Hagrid",
                    type: "action",
                    action: "setColorTheme",
                    payload: "classic"

                    },
                    {
                    name: "Dark Star",
                    type: "action",
                    action: "setColorTheme",
                    payload: "darkStar"
                    },
                      {
                    name: "Yellow Orchestra",
                    type: "action",
                    action: "setColorTheme",
                    payload: "yellowOrchestra"
                    },
                ]

    }

  ]
}
export {menuValues}


//olika ljup i menuValues beroende på hur långt en har klickat in sig.
// om du har klickat in dig en nivå så är menuValues[nivå]
