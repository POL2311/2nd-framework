import {test,expect} from '@playwright/test'
import { LoginPage } from '../../pages/login.base'
test.describe('User Authentication', () =>{
    let loginPage: LoginPage;
    test.beforeEach(async({ page })=> {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo('https://www.saucedemo.com');
    });
    test('first login on saucedemo', async({ page }) => {
    const lp = new LoginPage(page);
    lp.loginWithCredentials('standard_user', 'secret_sauce');
    await expect(loginPage.getErrorMessage()).toBeHidden();
});
});
