const Messages = require('../models').message;
const users = require('../models').users;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var io = require('socket.io')(8000);

chatHistory = async (data)=>{
    try {
        let messages = await  Messages
        .findAll({
            include: [{
                model: users,
                as: 'UsenderId',
                attributes: [['fullName', 'SenderfullName'],['profilePicture', 'SenderprofilePicture']]
            },
            {
                model: users,
                as: 'UrecvrId',
                attributes: [['fullName', 'ReciversfullName'],['profilePicture', 'ReciverprofilePicture']]
            }],
            
            attributes: [
                ["id", "messageId"],
                ["senderId", "senderId"],
                ["receiverId", "receiverId"],
                ["message", "message"],
                ["conversationId", "conversationId"],
                ["createdAt", "createdAt"],
                ["isred", "isred"],
                // [Sequelize.fn("MAX", Sequelize.col("createdAt")), "createdAt"]
                [Sequelize.col("UrecvrId.fullName"), "ReciversfullName"],
                [Sequelize.col("UrecvrId.profilePicture"), "ReciverprofilePicture"],
                [Sequelize.col("UsenderId.fullName"), "SenderfullName"],
                [Sequelize.col("UsenderId.profilePicture"), "SenderprofilePicture"]
                
            ],
            where: {
                // [Op.or]: [{ senderId: data.id }, { receiverId: data.id }],
                [Op.and]:[
                    {[Op.or]: [{ senderId: data.id }, { receiverId: data.id }]},
                    {id: {[Op.in]: 
                        [
                            Sequelize.literal('SELECT DISTINCT MAX(id) FROM `messages` GROUP BY `conversationId`') 
                        ]}}
                    ]
            },
            group: ['conversationId'],
            order: [['createdAt','DESC']],
            raw: true
        })

        if(messages) {
            let count = await Messages.count({
                where:{
                    // [Op.and]:[{ isred: {[Op.ne]: 1 }}, {[Op.or]: [{ senderId: data.id }, { receiverId: data.id }]}]
                    [Op.and]:[{ isred: {[Op.ne]: 1 }}, { receiverId: data.id }]

                },
                group:['conversationId', 'senderId'],
            })
            if(count) {
            
                    let chatList = []
                    messages.forEach((val, i)=>{
                        var countObj = count.find(c => c.conversationId === val.conversationId)
                        chatList.push({
                            ...val,
                            unread_count: (countObj) ? countObj.count : 0
                        })
                    })
                    // console.log("CHAT_LIST", chatList)                
                    // socket.emit('CHAT_LIST', {chatList, status: true}) 
                    return({chatList, status: true})              
                
            }
            // else{
            //     console.log("else...", messages)
            //     let chatList = []
            //     chatList.push({
            //         ...messages,
            //         unread_count: 0
            //     })
            //     return({chatList, status: true}) 
            // }
        }
    } catch(err) {
        return({err, status: false})
    }
      
}

io.on('connection', function(socket) {

    socket.on('JOIN_ROOM', function(data) {
        socket.join(data.conversationId)
    })

   //Get Chat List
    socket.on('RECEIVE_CHAT_LIST', async  function(data){
        var result = await chatHistory(data);
        socket.emit('CHAT_LIST', result)
    })

    //Chat History
    socket.on('SEND_MESSAGE', function(data){
        let dataInfo = data.data;
        let conversationId = dataInfo.senderId>dataInfo.receiverId ? dataInfo.receiverId+"_"+dataInfo.senderId : dataInfo.senderId+"_"+dataInfo.receiverId           
        Messages.create({
            senderId: dataInfo.senderId,
            receiverId: dataInfo.receiverId,
            conversationId: conversationId,
            message: dataInfo.message
        })
        .then(msg=>{
            let response = msg.dataValues;
            io.in(conversationId).emit('RECEIVE_MESSAGE',response);
            socket.broadcast('RECEIVE_MESSAGE', response)
        })
        .catch(msgErr=>{
            socket.emit('RECEIVE_MESSAGE', {msgErr})
        })
        
    })

    // Check Message Status (IS_READ ?)

    socket.on('IS_READ', function(msgStatus){
        console.log('isread? :- ', msgStatus)
        Messages
        .update({
            'isred': 1
        },{
            where:{
                [Op.and]: [
                        {conversationId: {[Op.eq]: msgStatus.conversationId}}, 
                        {receiverId: {[Op.eq]: msgStatus.senderId}}, 
                        {senderId: {[Op.eq]: msgStatus.receiverId}},
                        {isred: {[Op.eq]: 0}}
                    ]
            }
        })
        .then(status=>{
            console.log("ISREAD:- ", msgStatus),
            // io.to(`${msgStatus.receiverId}`).emit('MSG_READ',msgStatus);
            // io.in(conversationId).emit('MSG_READ', msgStatus);
            socket.broadcast('MSG_READ', {msgStat: "msgStatus"});
        })
        .catch(statusErr=>{
            socket.broadcast('MSG_READ', {status: statusErr});
        })

    })

    // typing...

    socket.on('START_TYPING',(user)=>{
        // socket.broadcast('TYPING', user)
        socket.broadcast.emit('TYPING', user)
        // io.to(`${user.receiverId}`).emit('TYPING', {typing: true})
    })

    // stop typing...
    socket.on('STOP_TYPING',(user)=>{
        socket.broadcast('TYPING', user)
        // socket.to('user.receiverId').emit('TYPING', {typing: false})
    })
})