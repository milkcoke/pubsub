const express = require('express');
const router = express.Router({mergeParams : true});
const dataChannel = require('../config/pub_sub');
const headerSet = require('../config/header');

function ServerEvent() {
    this.data = "";
}
ServerEvent.prototype.payload = function() {
    return this.data + '\n';
}
//여러명 손님 등록해도 처리함.
ServerEvent.prototype.addCustomer = function(customer){
    console.log(`customer: ${customer}`);
        this.data += customer + '\n';
}
function initializeSSE(request, response){
    const topic = request.params.id;

    dataChannel.subscribe(topic, function(channel, message){
        const messageEvent = new ServerEvent();
        console.log(`message : ${message} ,channel: ${channel}`);
        // 전체 데이터(모든 손님)에 메시지 (손님)를 한줄 추가함.
        const newCustomer = JSON.parse(message);
        messageEvent.addCustomer(message);
        //메시지를 한줄 (여러줄도 가능은함) 덧붙여줌.
        outputSSE(request, response, messageEvent.payload());
    });
    response.set(headerSet);
}
function outputSSE(request, response, allCustomers) {
    response.write(`${allCustomers}`);
}
router.get('/', initializeSSE);

router.post('/', (request, response)=>{
    const {name, ...rest} = request.body;
    if(name === null) {
        return response.status(400).json({
            message: "you need to describe 'name' of customer"
        });
    } else {
        //publish can only use argument type of 'String' or 'Date'
        const newCustomerInfoJson = JSON.stringify(request.body);
        dataChannel.publish(request.params.id, newCustomerInfoJson);
        response.status(201).json({
            message: `${name} customer is registered successfully`
        });
    }

});

module.exports = router;