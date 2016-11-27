describe('login', function() {
  it('login As 250', function() {
    browser.get('http://okecust.applinzi.com');
    element(by.model('username')).sendKeys('250');
    element(by.model('password')).sendKeys('123456');
    element(by.id('loginBtn')).click();
    var name = element(by.id('teacher.name')).getInnerHtml();
    expect(name).toEqual('网一饭');
  });
});