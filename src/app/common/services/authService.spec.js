describe('authService', function() {

    var authService,
        $httpBackend,
        $scope;

    beforeEach(module('meshAdminUi.common', 'ngCookies'));
    beforeEach(inject(function(_authService_, _$httpBackend_, $rootScope) {
        authService = _authService_;
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
    }));

    function respondWithCode(code) {
        $httpBackend.whenGET(/\/api\/v1\/auth\/me.*/).respond(code, { data: {} });
        $httpBackend.whenGET(/\/api\/v1\/auth\/login.*/).respond(code, { data: {} });
        $httpBackend.whenGET(/\/api\/v1\/auth\/logout.*/).respond(code, { data: {} });
    }

    afterEach(function() {
        authService.logOut();
    });

    it('should not be logged in initially', function() {
        expect(authService.isLoggedIn()).toBe(false);
    });

    it('should log in with correct credentials', function() {
        respondWithCode(200);

        authService.logIn('correct', 'credentials')
            .then(function() {
                expect(authService.isLoggedIn()).toBe(true);
            });

        $httpBackend.flush();
        $scope.$apply();
    });

    it('should not log in with incorrect credentials', function() {
        respondWithCode(401);
        authService.logIn('incorrect', 'credentials')
            .then(function() {
                expect(authService.isLoggedIn()).toBe(false);
            });

        $httpBackend.flush();
        $scope.$apply();
    });

    it('should log out', function() {
        respondWithCode(200);
        authService.logIn('admin', 'admin')
            .then(function() {
                return authService.logOut();
            })
            .then(function() {
                expect(authService.isLoggedIn()).toBe(false);
            });

        $httpBackend.flush();
        $scope.$apply();
    });
});