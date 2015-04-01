var BASE_URL = 'http://localhost/gentics/cailun-admin-ui/build/';

describe('Login page', function() {

    var userNameInput = element(by.model('vm.userName')),
        passwordInput = element(by.model('vm.password')),
        submitButton = element(by.css('button[type="submit"]'));

    it('should have a title', function() {
        browser.get(BASE_URL);

        expect(browser.getTitle()).toEqual('Cai Lun Admin UI');
    });

    it('should redirect to login when not logged in', function() {
        browser.get(BASE_URL + 'projects');

        expect(browser.getCurrentUrl()).toBe(BASE_URL + 'login');
    });

    it('should display error on login failure', function() {
        browser.get(BASE_URL);

        userNameInput.sendKeys('wrong user');
        passwordInput.sendKeys('wrong password');
        submitButton.click();

        expect(element(by.css('h2')).getText()).toEqual('Error');
    });

    it('should forward to projects page on success', function() {
        browser.get(BASE_URL);

        userNameInput.sendKeys('admin');
        passwordInput.sendKeys('admin');
        submitButton.click();

        expect(browser.getCurrentUrl()).toBe(BASE_URL + 'projects');
    });
});