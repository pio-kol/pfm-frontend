describe('Navigation Bar tests', function() {

    var HTTP_LOCALHOST_8889 = 'http://localhost:8889';

    it('Should contain navigation bar', function() {
        //given
        var expectedMenuLabels = ['Transaction history', 'Categories', 'Accounts'];

        //when
        browser.get(HTTP_LOCALHOST_8889);

        //then
        var actualMenuLabels = element.all(by.id('navbarMenuItem')).map(function(elem){
            return elem.getText();
        });

        expect(actualMenuLabels).toEqual(expectedMenuLabels);
        expect(element(by.id('navbarHeader')).getText()).toBe('Personal Finance Manager');
        expect(element(by.id('signUpMenuItem')).getText()).toBe('Sign up');
        expect(element(by.id('loginMenuItem')).getText()).toBe('Login');
        expect(element(by.id('languageMenuItem')).getText()).toBe('EN');
    });

    it('Should contain polish navigation bar', function() {
        var expectedMenuLabels = ['Historia transakcji', 'Zarządzanie kategoriami', 'Zarządzanie kontami'];
        var languageChooser = by.id('languageMenuItem');

        //when
        browser.get(HTTP_LOCALHOST_8889);
        element(languageChooser).click();

        //then
        var actualMenuLabels = element.all(by.id('navbarMenuItem')).map(function(elem){
            return elem.getText();
        });

        expect(actualMenuLabels).toEqual(expectedMenuLabels);
        expect(element(by.id('navbarHeader')).getText()).toBe('Formularz wydatków');
        expect(element(by.id('signUpMenuItem')).getText()).toBe('Utwórz konto');
        expect(element(by.id('loginMenuItem')).getText()).toBe('Zaloguj się');
        expect(element(languageChooser).getText()).toBe('PL');
    });

    it('Should move to correct pages using menu navigation', function() {
        //given
        var separator = '/#/';
        var siteUrls = ['transactions', 'categories', 'accounts'];
        var menuSize = 3;

        browser.get(HTTP_LOCALHOST_8889);
        var menuElements = element.all(by.id('navbarMenuItem'));

        expect(menuElements.count()).toBe(menuSize);

        for(i = 0; i<menuSize; ++i){
            //when
            menuElements.get(i).click();
            //then
            expect(browser.getCurrentUrl()).toBe(HTTP_LOCALHOST_8889 + separator + siteUrls[i]);
        }

    });

});
