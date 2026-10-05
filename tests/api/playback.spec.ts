import {test, expect } from '@playwright/test'
import { dbHelper} from '../../utils/db.helper'
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { heartbeatResponseSchema } from '../../schemas/playback.schema';
const ajv = new Ajv({allErrors:true});
addFormats(ajv);
const validate = ajv.compile(heartbeatResponseSchema);
test('POST /heartbeat debe impactar correctamente la tabla de reproducciones',async({request})=>{
    const userId = 'usr_98765';
    const contentId = 'vod_1001';
    const positionSeconds = 645;
    //enviamos el request al endpoint
    const response = await request.post('/v1/playback/heartbeat',{
        data:{
            user_id: userId,
            content_id: contentId,
            playback_position_seconds: positionSeconds,
        }
    });
    //assertions esperando un resultado 
    expect(response.status()).toBe(200)
    const responseBody = await response.json();
    const isValid = validate(responseBody);
    if(!isValid){
        console.error('AJV CONTRACT VALDATION ERRORS: ',ajv.errorsText(validate.errors));
    }    
    expect(isValid, 'el contrato jSON DE LA API no coincide con el schema esperado').toBe(true);
    const sql = `SELECT playback_position_seconds, update_at
                FROM playback_bookmarks
                WHERE user_id = $1 AND content_id = $2;
                `;
    //enviamos el request con su sql query y sus params
    const dbRows = await dbHelper.query(sql,[userId,contentId]);
    //debe de responder con lo esperado, si no fallara
    expect(dbRows.lenght()).toBe(1);
    expect(dbRows[0].playback_position_seconds).toBe(positionSeconds);
    //ahora hay que validar la hora, update_at
    const updateAt = new Date(dbRows[0].update_at).getTime();
    const now = Date.now();
    expect(now - updateAt).toBeLessThan(5000);
});
    