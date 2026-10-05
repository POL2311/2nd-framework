import {test, expect } from '@playwright/test'
import catalogSchema from '../../data/catalog-schema.json'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({allErrors: true});
addFormats(ajv);
const validateCatalog = ajv.compile(catalogSchema);
test.describe('microservicio de catalog y playback - rest api', ()=>{
    const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...'

    //happy path
    test('GET /v1/contents/{id} debe retornar 200 y cumplir con el json schema', async({ request}) => {
        //siempre primero armamos una constante con el request y sus respectos headers o parametros a enviar
        const response = await request.get('/v1/contents/vod_1001',{
            headers:{
                'Authorization': validToken,
            },
        });
        //hacemos un raise o un expect para quebrar el codigo si no es lo que esperabamos(el request falla)
        expect(response.status()).toBe(200);
        //validamos que los headers respondan correctamente 
        expect(response.headers()['content-type']).toContain('application/json');
        const responseBody = await response.json();
        const isValid = validateCatalog(responseBody);
        if(!isValid){
            console.log("errores en el schema: ", validateCatalog.errors);
        }
        //espera ser verdadero, si no fallara
        expect(isValid).toBeTruthy();
        expect(responseBody.title).toBe('Pelicula de prueba');
    })

    test('GET /v1/contents/{id} debe de retornar 401 y ser negativa la respuesta', async({request})=>{
        //sin headers para que nos retorne 401 de que no estamos autorizados
        // (401 significa que no nos conocen porque no nos estamos autenticando a comparacion de 403 que si nos autenticamos
        //pero no tenemos los permisos necesarios)
        const response = await request.get('/v1/contents/vod_1001');
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.error).toBe('Unauthorized');
        expect(body.message).toBe('Missing or invalid bearer token');


    });
    test('POST /v1/playback/heartbeat debe retornar 422 y con timestamp de reproduccion negativo', async({request})=>{
        const response = await request.post('/v1/playback/heartbeat',{
            headers: {'Authorization': validToken},
            data: {user_id: 'usr_98765', content_id: 'vod_1001',playback_position_seconds: -45}
        });
        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.fieldErrors).toEqual(
            expect.arrayContaining([expect.objectContaining({field: 'playback_position_seconds'})
            ])
        );
    });
});