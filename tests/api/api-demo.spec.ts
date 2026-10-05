import {test,expect} from '@playwright/test';
import schema from '../../data/schema.json';
import Ajv from 'ajv'
const ajv = new Ajv();
const productSchema = schema;
const validateProduct = ajv.compile(productSchema);

//happy path test
test.describe('API Testing con playwright & schema validation',() => {
    test('GET /products/1 - debe de responder 200 y cumplir con el schema @api',{tag: ['@api']}, async({ request })=>{
        const response = await request.get('https://dummyjson.com/products/1');
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(response.headers()['content-type']).toContain('application/json');
        const valid = validateProduct(body);
        if(!valid){
            console.error('ocurrio un error en la validacion de ajv: ', ajv.errorsText(validateProduct.errors));
        }
        expect(valid).toBe(true);
        expect(body.tags).toContain('beauty')
        let reviewerName = await body.reviews[0].reviewerName.includes('Eleanor Collins')
        if(reviewerName){
            reviewerName = true
            console.log('existe')
        }else
        {
                        reviewerName = false
                        console.log('no existe')
                        expect(reviewerName).toBe(true)

        }
        expect(body.reviews[0].reviewerName).toBe('Eleanor Collins')
    });
});
test('Mock API from HAR file in playwright @smoke', async ({ page }) => {
    // Recording a HAR file
    await page.routeFromHAR('./har/fruits.har', {
        url: '/*/**/api/v1/fruits',
        update : false
    });
    
    // Go to URL
    await page.goto('https://demo.playwright.dev/api-mocking/');
    
    // Validate text
    await expect(page.getByText('Strawberry')).toBeVisible();
});


test('Ejecutar pruebas offline usando un HAR previamente grabado "@test-api-response', async ({ context }) => {
  // Playwright interceptará las llamadas y devolverá las respuestas exactas guardadas en el HAR
  await context.routeFromHAR('schemas/mock-responses.har', {
    url: '**/api/v1/**', // Aplica solo a las rutas de API
    update: false,       // No actualiza, solo lee el archivo (modo playback)
    notFound: 'abort',   // Si una petición no está en el HAR, la bloquea para evitar llamadas reales
  });
});