import { test as setup , expect } from '@playwright/test'
import { LoginPage } from '../pages/login.base'
let authPath = 'playwright/.auth/user.json'
setup('saving credentials of authentication', async({ page })=> {
    let loginPage: LoginPage
    loginPage = new LoginPage(page);
    await loginPage.navigateTo('https://www.saucedemo.com')
    await loginPage.loginWithCredentials(process.env.TEST_USER, process.env.TEST_PASSWORD);
    await expect(loginPage.getErrorMessage()).toBeHidden();
    await page.context().storageState({path: authPath});
})