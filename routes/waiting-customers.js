const express = require('express');
const router = express.Router({mergeParams : true});
const header = require('../config/header');
const StoreSession = require('../model/storeSession');


const storeMap = new Map();

async function registerAtServer(storeId, request, response, rows = {}){

    // Register at storeMap, if not construct 'date?'
    // default Constructor new Date (시간으로 id 부여)
    const clientSession = new StoreSession(response);

    // 첫 로그인이면 map 에 등록하며 첫 세션 등록, 아니면 해당 가게 아이디 세션 배열리스트에 추가
    !storeMap.has(storeId) ? storeMap.set(storeId, [clientSession]) : storeMap.get(storeId).push(clientSession)

    // 연결 해제 이벤트 등록, 로그아웃 or 창 닫기 or Activity Destroy 시 세션 해제 => 배열에서 삭제.
    request.on('close', ()=>{
        console.log(`session id : ${clientSession.sessionId} is closed the session`);
        storeMap.get(storeId).filter(storeSession=> storeSession.sessionId !== clientSession.sessionId);
    });

}

async function updateToALLClient(storeId, newCustomer){
    // const sql = `select * FROM waiting_customer WHERE store_id = storeId`;
    console.log(JSON.stringify(newCustomer));
    // this result is from sql execute
    const result = {
        name : 'vladimir',
        age : 15
    };

    storeMap.get(storeId).forEach(client => {
        console.log(`this client session Id : ${client.sessionId}`);
        client.response.write(`${JSON.stringify(newCustomer)}\n`);
    });
}



router.get('/', (request, response)=>{
//     Logic of READ list of waiting-customers (Query result == rows)
    const result = {}
    response.writeHead(200, header);
    response.write(JSON.stringify(result));
    registerAtServer(request.params.storeId, request, response, result).then(() => console.log(`login session registering is complete!`));
})

router.get('/status', (request, response)=>{
    let sessionList = "";
    for (const storeSessions of storeMap) {
        sessionList += storeSessions + '\n';
    }
    response.status(200).end(sessionList);
});

router.post('/', (request, response)=>{
    // const [storeId, name, age] = [request.params.storeId, [request.body]];
    const storeId = request.params.storeId;
    // const {name, age} = request.body;
    const newCustomer = request.body;

    // if Query get the right result (rows)
    updateToALLClient(storeId, newCustomer).then(() => console.log('notify to all store staff client!'));

    return response.status(200).json({
        message : `${newCustomer.name} is registered at store!`
    });
});

module.exports = router;