describe('HomeController', function(){
	var controller, scope, ExampleService;

	beforeEach(module('IonicGulpSeed'));
	beforeEach(module('AppTemplate'));

	beforeEach(inject(function($rootScope, _$controller_, _ExampleService_){
		scope = $rootScope.$new();
		controller = _$controller_('HomeController', {
			$scope: scope,
			ExampleService: _ExampleService_
		});
		ExampleService = _ExampleService_;

		sinon.stub(ExampleService, 'doSomethingAsync', ExampleService.doSomethingAsync);
	}));

	it('calls the method doSomethingAsync()', function(){
		scope.fetchRandomText();
		expect(ExampleService.doSomethingAsync.called).to.eq(true);

	});

});