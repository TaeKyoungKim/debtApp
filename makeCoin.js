const CaverExtKAS = require('caver-js-ext-kas')
const caver = new CaverExtKAS()

const accessKeyId = "kas api 에서 생성한 accessKeyId ";
const secretAccessKey = "kas api 에서 생성한 secretAccessKey";

const chainId = 1001 // 클레이튼 테스트 네트워크 접속 ID 

caver.initKASAPI(chainId, accessKeyId, secretAccessKey) //KAS console 초기화

const keyringContainer = new caver.keyringContainer()
const keyring = keyringContainer.keyring.createFromPrivateKey('your wallet privatekey')
keyringContainer.add(keyring)


async function create_token(){      //토큰 생성 function
    const kip7 = await caver.kct.kip7.deploy({
        name: 'masan5',     //토큰 이름
        symbol: 'KK',       //토큰 심볼
        decimals: 0,        //토큰의 소수점 자리 수
        initialSupply: '10000000000', //토큰의 발행량
    }, keyring.address, keyringContainer) // keyringContainer를 이용하여 주소 등록
    console.log(kip7._address)
}
// create_token() 최소 한번만 실행하고 
// create_token() 
const kip7 = new caver.kct.kip7('creat_token() 실행시 생성되 주소') 
kip7.setWallet(keyringContainer)//kip7 내의 wallet 설정     

async function balanceOf(_address){
          //생성된 토큰의 Address 입력
          //kip7 내의 wallet 설정  
    const receipt = await kip7.balanceOf(_address)  //balanceOf('토큰 조회할 주소')
    console.log(receipt);
    return receipt
}

async function token_trans(_address){       //token 송금 function   //생성된 토큰의 Address 입력
               
    const receipt = await kip7.transfer(_address, '500', { from: keyring.address })       //transfer('토큰 받는 주소', 토큰 양, {from:'트랜젝션을 일으키는 주소'})
    console.log(receipt);
}

async function create_wallet(){     //wallet 생성 function
    const wallet = await caver.kas.wallet.createAccount()   //wallet 생성
    console.log(wallet);
}



// create_wallet()
// token_trans('0xD067133Cb5689079B2FFF814Bd9c6E80F4014a99')
balanceOf('0xf31f5b9bc876754efff3c74496a77a0bcfa59123')