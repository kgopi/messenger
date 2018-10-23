import {create} from 'socketcluster-client';
import request  = require('request');
const argv = require('minimist')(process.argv.slice(2));

console.log(argv);

var count = 0;
var oo = null;

class Connection{

    _id:number;

    constructor(id){
        this._id = id;
    }

    async init(){
        try{
            if(oo == null){
                oo = await this.getAuthToken();
            }
            this.initConnection(oo);
        }catch(e){
            console.log(e);
        }
    }

    getAuthToken(){
        let cookie = 'sid=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiZGlyIn0..WgQol882Hm8_CU75.7wyX0Q4EE7UHvVouzXxJ1xc4xY13shpLOUXtCiZH_ITOgCA0v6fGXe7JORD25PK-ZD9hjIz7mDFyPajFLcif65CSTuZ585DZzKKLZg285XuMWRm5DX8AVAnqs4eTivjGmXe4qq2HERwiCV8LM-bN0VP9K4jQR_gXCMUDCSZLH-gj-X32fT60c8_pLRsS16Hb6qfNbxPkD9uLLmm7FyhnbH9cTFaSlFJqeSVZF2JOhN6_zzSZm7zZ_2-uefSq5QqzqVb-TCMQ6gfrFDrNpaUTSefhLz--T_Wt7pPyWQ7FVWnj3eFB444pwyD5oKsnEPwvTEQE1CnWjz9pQGUggPrmAvZaCDJyfe3ySe9ZSURBgXlo4UVn37SL_QLPMh8vJNUMJlIN4dGiG-36_IvyNbGOFyMLWwMEJHY5YSwfuxeH8z-j56-XuDG0P_bpYyTNITNw98KH8JU5fa_h-FpF2aMzg0MRcWvUTrbwyhtCdDuBjW1kNlPe1TnxciL2_nguk2jJNLE85omXxlRpNOov3fo3nMtG9StZCuC0XLqxxE7cAa82u4T_C71yhyDi1cZUzUZGPj-bhXggcW8mQNExcE80kvSSyxg7Z3R2vhBFULruNMUzeE--E9IEQ2JpSDZ4pszRU2yfV0L-XLLSIrSUMJU-mh_VKBH15WZSoFHWmKEKi5sRQJ7r5soTcLomCTHZheCFXAG-G4YjJw_o6lR0xc2xC7EzJRmT4_vrpxv41jZ5AoxTU8WrE6HlYQntRMjQ64hVW9YTTaIUkedZpw1abyVw8eEn38oq2F9JOy1tfKAPLKijoogSTCjn7FWidz06WEMnQp5ip9gGheEl_sIlII5XDEvpzVIJxNp4Asjv_IZsE1GKR2QCdNRFPVFYiQqsK6lnHCW0mgFp0MoLud_PNJOCbd-YfNuogLhz8lyJH8cpuuQMWeURV1J0sNPRb_buEdgLo6UMlG6aqM3f5AJb_Sk-CnQ8npeLlC2t7l-7vrM05Ft5AL_O8YeFHzwuf9cK54Ztz-AZ6NH9wrDoPXj070UEGPg9HI8gT5xWnwPNc3xk4XJvrmLDijkFZoFS5wRK9A3Lfit4vsZ6RLKLi1nmHbCvviQ-fx5d1UWVGyxa0O9C7eZWqy5b4B6wJJi5bZmE9M_lcqUbuPEiSqCyd8bMKgIMQajfGqZSRFknMC_Oco997HJ0t4aDjpF2yLm5VV2IF2dyJnz0e_NndifPKf9B_V3q4_Oobt_jykvalHl0fiWkNTRt3Sa1xjeZHOTgHNxiYN05MINJPkWpwqkBiEFf7FkFSYeiF8tLXhBjYJxCnOTzkLbNV9mC7vm-hd-tDnoPTo4UJrrpS73wM_OHgBjAjl99fza1FcqV9jLT8dQlloUQkKZYSVV__HOVkEhiZbXZ95WDbsV3nKwGGmiOO63CWkMpt9nbzWjhXmh3XFHnLzYSg0Vmua0tuuqNQ56fYHRITmYa0Uwg8AhxaBfirPjubOAzG2SfmPaOp4yCgB7X28C6jOCJLF_thsI3ikn7SMyXk6JvbLDlCuPFnLDJMEa0mTPqbdAZGfMTpboWui1S7nhlQylFTH4BvNsFpo-a3jXtTgD_BcYFh8HSXQgY6BRlPSC8Df06vNVPcGRd1sManmQkol0KLpptvtdj1jIkHv4hWYp5hL4o7WFPPoCZFFqnEcaFHfaNxnkmZoq2gLRNS20ph35LY4-iczsG5h76cFI063QghqL-KVF76I7nNTAsJraiRLGhql163dPPm-tOUDEUmx-oeAHBtnZu6BTJC8nnZwRr35rCrmn5-O214Br2eTLa2xoTK_LISC7sO4wOswQ5hNjC9J6zLDuTNb53KQneqKy-lOStZdqdrl717sm0fdxX02SAh8lG.N3Wp0MJ3xP_MW6hbKvmMBw; _ga=GA1.2.655040836.1540272299; _gid=GA1.2.1637818307.1540272299; _gat=1';
        return new Promise((resolve, reject) => {
            request.get("https://abstract-gong360.develgs.com/v1/messenger/token", {"pool":false, headers: { 'content-type': 'application/json', cookie } }, (err, data) => {
                try {
                    if (err || data.statusCode != 200) {
                        return console.error(`Token request failed for ${this._id}, reason: `, err || data.body);
                    }
                    resolve(JSON.parse(data.body).token);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }

    initConnection(id){
        var options = {
            hostname: "ant-messenger.develgs.com:443",
            secure: true,
            path: "/",
            autoReconnect: false,
            query: {id}
        };
        const socket = create(options); // Initiate the connection to the server

        socket.on('connect', () => {
            console.log(`WebSocket connection is successful ... ${this._id}`);
            count++;
        });

        socket.on('messages', (messages) => {
            // messages.forEach((message)=>{
            //     console.log(`Message recieved for ${this._id}`, message);
            // })
        });

        socket.on('connectAbort', (eve)=>{
            console.log(`connectAborted for ${this._id}`, eve);
        });
    }

}

class LoadRunner{

    size:number;

    constructor({size}){
        this.size = size;
    }

    start(){
        for(let i=0; i<this.size; i++){
            setTimeout((id)=>{
                let connection = new Connection(id);
                connection.init();
                if(id == this.size-1){
                    setTimeout(()=>{
                        console.log(count);
                    }, 10000);
                }
            }, 0, i);
        }
    }

}

new LoadRunner({size: argv.s}).start();