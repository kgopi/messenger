export default {
    channelSubscriptions:{
        inApp:{
            displayOrder: 1,
            isEnabled: false,
            settings:{
                isSoundEnabled: true
            }
        },
        email:{
            displayOrder: 2,
            isEnabled: false,
            settings:{

            }
        }
    },
    eventSubscriptions:{
        ANT:{
            label: "Timeline",
            displayOrder: 1,
            inApp: true,
            email: true,
            events: {
                ACT_MENTION: {
                    label: "ACT_MENTION",
                    displayOrder: 1,
                    inApp: true,
                    email: true
                }
            }
        }
    }
 }