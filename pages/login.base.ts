import { BasePage } from "./base.page";
import {test, expect, Locator, Page} from '@playwright/test'
export class LoginPage extends BasePage{
    private readonly usernameTXT: Locator
    private readonly passwordTXT: Locator
    private readonly loginButton: Locator
    private readonly errorMessage: Locator
    constructor(page: Page){
        super(page);
        this.usernameTXT = this.page.getByRole('textbox',{name: 'Username'});
        this.passwordTXT = this.page.getByRole('textbox',{name: 'Password'});
        this.loginButton = this.page.getByRole('button',{name: 'Login'});
        this.errorMessage = this.page.getByRole('button',{name: 'Dissmiss error'});
    }
    async enterCrendentials(username: string, password: string): Promise<void>{
        await this.usernameTXT.fill(username);
        await this.passwordTXT.fill(password);
    }
    async submitLogin(): Promise<void>{
        await this.loginButton.click({force: true});
    }
    getErrorMessage(): Locator {
        return this.errorMessage;
    }
    async loginWithCredentials(username: string, password: string): Promise<void>{
        await this.enterCrendentials(username,password);
        await this.submitLogin();
    }
}