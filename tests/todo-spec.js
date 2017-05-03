describe('log in testing', function() {

    beforeAll(() => testLogin());

    it('should redirect to main page after filling a form', function() {
        expect(browser.getCurrentUrl()).toEqual("http://localhost:3000/#!/");
    });

    it('should put a cookie after log in', function() {
        browser.manage().getCookie('customer')
            .then(function(cookie) {
                var userObject = JSON.parse(decodeURIComponent(cookie.value));
                expect(userObject).toEqual({
                    "username": "test user",
                    "email": "test2@user.com",
                    "credit": 100,
                    "orders": []
                });
            });
    });
});

describe('mytable testing', function() {

    beforeAll(() => testLogin());

    it('should disable order button if the credit is not enought', function() {
        expect(element.all(by.repeater("drink in drinks")).get(2).$('[ng-click="putOrder(drink)"]').isEnabled()).toBe(true);
        element.all(by.repeater("drink in drinks")).get(2).all(by.css(".col")).get(1).getText().then(function(price) {
            $(".card-action").$(".flow-text").getText().then(function(text) {
                var credit = parseInt(text.replace('Credit: ', ''));
                expect(price * 2 > credit).toBe(true);
                element.all(by.repeater("drink in drinks")).get(2).$(".material-icons").click().then(function() {
                    expect(element.all(by.repeater("drink in drinks")).get(2).$('[ng-click="putOrder(drink)"]').getAttribute('class')).toContain('disabled');
                });
            });
        });
    });

    it('should add 100 credits by clicking add credit button', function() {
        $(".card-action").$(".flow-text").getText().then(function(text) {
            var creditBefore = parseInt(text);
            $('[ng-click="addCredit()"]').click().then(function() {
                $(".card-action").$(".flow-text").getText().then(function(text) {
                    expect(parseInt(text)).toEqual(creditBefore + 100);
                });
            });
        });
    });

});

describe('kitchen testing', function() {

    it('should add order to the kitchen after customer`s action', function() {
        browser.get('http://localhost:3000/#!/kitchen');
        browser.sleep(1000);
        element.all(by.repeater('order in orders')).count().then(function(countBefore) {
            testLogin();
            element.all(by.repeater("dish in dishes")).get(0).$(".material-icons").click().then(function() {
                browser.get('http://localhost:3000/#!/kitchen');
                browser.sleep(1000);
                element.all(by.repeater('order in orders')).count().then(function(count) {
                    expect(count).toEqual(countBefore + 1);
                });
            });
        })
    });

    it('should change order state and move after cook`s action', function() {
        testLogin();
        element(by.repeater("dessert in desserts")).$(".material-icons").click();
        browser.get('http://localhost:3000/#!/kitchen');
        browser.sleep(1000);
        $("#ordered").$(".col").getText()
            .then(function(textOrderedBeforeClick) {
                $("#ordered").$(".waves-effect").click()
                    .then(function() {
                        $("#cooking").$(".col").getText()
                            .then(function(textCookingAfterClick) {
                                $("#ordered").$(".col").getText()
                                    .then(function(textOrderedAfterClick) {
                                        expect(textCookingAfterClick === textOrderedBeforeClick && textOrderedBeforeClick !== textOrderedAfterClick).toBe(true);
                                    });
                            });
                    });
            });
    });
});

function testLogin() {
    browser.get('http://localhost:3000/#!/login');
    // browser.get('https://drone-space-bar.herokuapp.com/#!/login');
    element(by.model('user.username')).sendKeys('test user');
    element(by.model('user.email')).sendKeys('test2@user.com');
    element(by.name('action')).click();
    browser.sleep(2000);
}
