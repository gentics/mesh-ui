var BASE_URL = 'http://localhost/gentics/cailun-admin-ui/build/';

describe('Login page', function() {

    it('should have a title', function() {
        browser.get('');

        expect(browser.getTitle()).toEqual('Cai Lun Admin UI');
    });

    it('should redirect to login when not logged in', function() {
        browser.get('projects');

        expect(browser.getCurrentUrl()).toBe(BASE_URL + 'login');
    });

    it('should display error on login failure', function() {
        var userNameInput = element(by.model('vm.userName')),
            passwordInput = element(by.model('vm.password')),
            submitButton = element(by.css('button[type="submit"]'));

        browser.get('');

        userNameInput.sendKeys('wrong user');
        passwordInput.sendKeys('wrong password');
        submitButton.click();

        expect(element(by.css('h2')).getText()).toEqual('Error');
    });
});