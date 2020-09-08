
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
            integer: true

        },
         {
            name:"y",
            type: "component",
            valueType:"GridSize",
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
            action:"changeArpeggio",
            payload: [3, 4, 3, 2]


        },{
            name:"major",
            action:"changeArpeggio",
            payload: [4, 3, 4, 1]

        }, {
            name:"custom",
            type: "component",
            component: "inputField"
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
              name: "Midi channels",
              type: "component",
              component: "MidiChannels",
            },

            {
                name: "Midi note properties",
                type: "component",
                component: "MidiOptionSliders",
                values: [
            {
            name:"velocity",
            type: "component",
            component: "Slider",
            valueType:"Midi",
            maxValue:1,
            minValue:0,
            initialValue: 0,
            integer: false

        },
         {
            name:"noteLength",
            type: "component",
            component: "Slider",
            valueType:"Midi",
            maxValue:1,
            minValue:0,
            initialValue: 0,
            integer: false

        }
        ]
            }
        ]
    }

  ]
}
export {menuValues}


//olika ljup i menuValues beroende på hur långt en har klickat in sig.
// om du har klickat in dig en nivå så är menuValues[nivå]
