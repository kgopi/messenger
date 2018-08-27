const ModelFactory = require("./../db/models");

function inactivate(req, res, next){
    const id = req.params.id;
    if(id){
        const EventsModel = ModelFactory.getEventsModel(req.headers.tenantId);
        EventsModel.findByIdAndUpdate(id, { visited: true }, null, (err)=>{
            if(err){
                consloe.error(`Failed to update the event ${id}`, err);
            }else{
                console.info(`Successfully updated the event ${id}`);
            }
        })
        res.status(200).json({result: true});
    }else{
        res.status(400).json({result: false, message: "Invalid request, event id is must."});
    }
    next();
}

module.exports = {
    inactivate: inactivate
}