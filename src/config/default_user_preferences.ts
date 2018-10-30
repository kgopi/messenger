export default {
    channelSubscriptions:{
        inApp:{
            displayOrder: 1,
            isEnabled: true,
            label: 'On Gainsight',
            settings:{
                isSoundEnabled: true
            }
        },
        email:{
            displayOrder: 2,
            isEnabled: false,
            label: 'Email',
            settings:{
                frequency: 'DAILY'
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
                    label: "Send me a notification, If I am mentioned",
                    displayOrder: 1,
                    inApp: true,
                    email: true
                },
                ACT_UPDATE: {
                    label: "Send me a notification, on each activity update",
                    displayOrder: 2,
                    inApp: true,
                    email: true
                }
            }
        }
    }
 }