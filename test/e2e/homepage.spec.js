describe('HomePage', function(){
	it('can render the homepage', function(){
		browser.get('/');
		var headerElem = element(by.css('h1.title'));

		expect(headerElem).not.to.be.null;

	});
});